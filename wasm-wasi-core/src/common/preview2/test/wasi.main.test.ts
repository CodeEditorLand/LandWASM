/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import RAL from '../../ral';
import assert from 'assert';

import { Alignment, u32 } from '@vscode/wasm-component-model';
import { SharedMemory } from '@vscode/wasm-wasi-kit';

import { WasiManagementClient } from '../wasiManagementClient';
import { WasiClient } from '../wasiClient';
import { createMonotonicClock } from '../clocks';
import { Pollable, createPoll } from '../io';

suite(`Wasi Worker Tests`, () => {

	let memory: SharedMemory;
	let managementClient: WasiManagementClient;
	let client: WasiClient;

	suiteSetup(async () => {
		memory = await SharedMemory.create();
		managementClient = new WasiManagementClient();
		await managementClient.launch(memory);
		const connectionInfo = await managementClient.createConnection();
		client = new WasiClient(memory, connectionInfo.port);
	});

	test(`setTimeout`, async () => {
		const memRange = memory.alloc(Alignment.word, u32.size * 2);
		const signal = memRange.getInt32View(0, 1);

		const start = Date.now();
		client.setTimeout(memRange, BigInt(100 * 1e6));
		Atomics.wait(signal, 0, 0);
		const diff = Date.now() - start;
		assert.ok(diff >= 100 && diff <= 150, `Time difference is: ${diff}`);
		memRange.free();
	}).timeout(2000);

	test('monotonic clock - resolution', () => {
		const clock = createMonotonicClock(client);
		assert.strictEqual(clock.resolution(), 1n);
	});

	test('monotonic clock - now', () => {
		const clock = createMonotonicClock(client);
		const expected = RAL().clock.monotonic();
		const actual = clock.now();
		assert.ok(actual >= expected);
		assert.ok(actual <= expected + BigInt(10e6));
	});

	test('monotonic clock - subscribe duration', async () => {
		const clock = createMonotonicClock(client);
		const start = Date.now();
		const pollable = clock.subscribeDuration(BigInt(100 * 1e6));
		assert.ok(!pollable.ready());
		pollable.block();
		const diff = Date.now() - start;
		assert.ok(diff >= 100 && diff <= 150, `Time difference is: ${diff}`);
		Pollable.$drop(pollable);
	}).timeout(2000);

	test('monotonic clock - subscribe instance', async () => {
		const clock = createMonotonicClock(client);
		const start = Date.now();
		const pollable = clock.subscribeInstant(BigInt((start + 100) * 1e6));
		assert.ok(!pollable.ready());
		pollable.block();
		const diff = Date.now() - start;
		assert.ok(diff >= 100 && diff <= 150, `Time difference is: ${diff}`);
		Pollable.$drop(pollable);
	}).timeout(2000);

	test('pollable list', async () => {
		const clock = createMonotonicClock(client);
		const first = clock.subscribeDuration(BigInt(100 * 1e6));
		const second = clock.subscribeDuration(BigInt(200 * 1e6));
		const poll = createPoll(client);
		const start = Date.now();
		let result = poll.poll([first, second]);
		let diff = Date.now() - start;
		assert.ok(diff >= 100 && diff <= 150, `Time difference is: ${diff}`);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0], 0);
		second.block();
		result = poll.poll([first, second]);
		diff = Date.now() - start;
		assert.ok(diff >= 200 && diff <= 250, `Time difference is: ${diff}`);
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0], 0);
		assert.strictEqual(result[1], 1);
	});
});