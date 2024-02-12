/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';

import { Alignment, u32 } from '@vscode/wasm-component-model';
import { SharedMemory } from '@vscode/wasm-wasi-kit';

import { WasiManagementClient } from '../wasiManagementClient';
import { WasiClient } from '../wasiClient';

suite(`Wasi Worker Tests`, () => {

	let memory: SharedMemory;
	suiteSetup(async () => {
		memory = await SharedMemory.create();
	});

	test(`setTimeout`, async () => {
		const memRange = memory.alloc(Alignment.word, u32.size * 2);
		const signal = memRange.getInt32View(0, 1);

		const managementClient = new WasiManagementClient();
		await managementClient.launch(memory);
		const connectionInfo = await managementClient.createConnection();

		const client = new WasiClient(connectionInfo.port);
		const start = Date.now();
		client.setTimeout(memRange, BigInt(500 * 1e6));
		Atomics.wait(signal, 0, 0);
		const diff = Date.now() - start;
		assert.ok(diff >= 500 && diff <= 600);
	}).timeout(2000);
});