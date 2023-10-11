/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as $wcm from '@vscode/wasm-component-model';
import type { u64, i64, ptr, i32 } from '@vscode/wasm-component-model';

export namespace random {
	/**
	 * The insecure-seed interface for seeding hash-map DoS resistance.
	 * 
	 * It is intended to be portable at least between Unix-family platforms and
	 * Windows.
	 */
	export namespace InsecureSeed {
		
		/**
		 * Return a 128-bit value that may contain a pseudo-random value.
		 * 
		 * The returned value is not required to be computed from a CSPRNG, and may
		 * even be entirely deterministic. Host implementations are encouraged to
		 * provide pseudo-random values to any program exposed to
		 * attacker-controlled content, to enable DoS protection built into many
		 * languages' hash-map implementations.
		 * 
		 * This function is intended to only be called once, by a source language
		 * to initialize Denial Of Service (DoS) protection in its hash-map
		 * implementation.
		 * 
		 * # Expected future evolution
		 * 
		 * This will likely be changed to a value import, to prevent it from being
		 * called multiple times and potentially used for purposes other than DoS
		 * protection.
		 */
		export declare function insecureSeed(): [u64, u64];
	}
	export type InsecureSeed = Pick<typeof InsecureSeed, 'insecureSeed'>;
	
	/**
	 * The insecure interface for insecure pseudo-random numbers.
	 * 
	 * It is intended to be portable at least between Unix-family platforms and
	 * Windows.
	 */
	export namespace Insecure {
		
		/**
		 * Return `len` insecure pseudo-random bytes.
		 * 
		 * This function is not cryptographically secure. Do not use it for
		 * anything related to security.
		 * 
		 * There are no requirements on the values of the returned bytes, however
		 * implementations are encouraged to return evenly distributed values with
		 * a long period.
		 */
		export declare function getInsecureRandomBytes(len: u64): Uint8Array;
		
		/**
		 * Return an insecure pseudo-random `u64` value.
		 * 
		 * This function returns the same type of pseudo-random data as
		 * `get-insecure-random-bytes`, represented as a `u64`.
		 */
		export declare function getInsecureRandomU64(): u64;
	}
	export type Insecure = Pick<typeof Insecure, 'getInsecureRandomBytes' | 'getInsecureRandomU64'>;
	
	/**
	 * WASI Random is a random data API.
	 * 
	 * It is intended to be portable at least between Unix-family platforms and
	 * Windows.
	 */
	export namespace Random {
		
		/**
		 * Return `len` cryptographically-secure random or pseudo-random bytes.
		 * 
		 * This function must produce data at least as cryptographically secure and
		 * fast as an adequately seeded cryptographically-secure pseudo-random
		 * number generator (CSPRNG). It must not block, from the perspective of
		 * the calling program, under any circumstances, including on the first
		 * request and on requests for numbers of bytes. The returned data must
		 * always be unpredictable.
		 * 
		 * This function must always return fresh data. Deterministic environments
		 * must omit this function, rather than implementing it with deterministic
		 * data.
		 */
		export declare function getRandomBytes(len: u64): Uint8Array;
		
		/**
		 * Return a cryptographically-secure random or pseudo-random `u64` value.
		 * 
		 * This function returns the same type of data as `get-random-bytes`,
		 * represented as a `u64`.
		 */
		export declare function getRandomU64(): u64;
	}
	export type Random = Pick<typeof Random, 'getRandomBytes' | 'getRandomU64'>;
	
}

export namespace random {
	export namespace InsecureSeed.$ {
		export const insecureSeed = new $wcm.FunctionType<typeof random.InsecureSeed.insecureSeed>('insecureSeed', 'insecure-seed', [], new $wcm.TupleType<[u64, u64]>([$wcm.u64, $wcm.u64]));
	}
	export namespace InsecureSeed._ {
		const functions: $wcm.FunctionType<$wcm.ServiceFunction>[] = [$.insecureSeed];
		const resources: $wcm.NamespaceResourceType[] = [];
		export type WasmInterface = {
			'insecure-seed': (result: ptr<[i64, i64]>) => void;
		};
		export function createHost(service: random.InsecureSeed, context: $wcm.Context): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.Context): random.InsecureSeed {
			return $wcm.Service.create<random.InsecureSeed>(functions, resources, wasmInterface, context);
		}
	}
	export namespace Insecure.$ {
		export const getInsecureRandomBytes = new $wcm.FunctionType<typeof random.Insecure.getInsecureRandomBytes>('getInsecureRandomBytes', 'get-insecure-random-bytes',[
			['len', $wcm.u64],
		], new $wcm.Uint8ArrayType());
		export const getInsecureRandomU64 = new $wcm.FunctionType<typeof random.Insecure.getInsecureRandomU64>('getInsecureRandomU64', 'get-insecure-random-u64', [], $wcm.u64);
	}
	export namespace Insecure._ {
		const functions: $wcm.FunctionType<$wcm.ServiceFunction>[] = [$.getInsecureRandomBytes, $.getInsecureRandomU64];
		const resources: $wcm.NamespaceResourceType[] = [];
		export type WasmInterface = {
			'get-insecure-random-bytes': (len: i64, result: ptr<[i32, i32]>) => void;
			'get-insecure-random-u64': () => i64;
		};
		export function createHost(service: random.Insecure, context: $wcm.Context): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.Context): random.Insecure {
			return $wcm.Service.create<random.Insecure>(functions, resources, wasmInterface, context);
		}
	}
	export namespace Random.$ {
		export const getRandomBytes = new $wcm.FunctionType<typeof random.Random.getRandomBytes>('getRandomBytes', 'get-random-bytes',[
			['len', $wcm.u64],
		], new $wcm.Uint8ArrayType());
		export const getRandomU64 = new $wcm.FunctionType<typeof random.Random.getRandomU64>('getRandomU64', 'get-random-u64', [], $wcm.u64);
	}
	export namespace Random._ {
		const functions: $wcm.FunctionType<$wcm.ServiceFunction>[] = [$.getRandomBytes, $.getRandomU64];
		const resources: $wcm.NamespaceResourceType[] = [];
		export type WasmInterface = {
			'get-random-bytes': (len: i64, result: ptr<[i32, i32]>) => void;
			'get-random-u64': () => i64;
		};
		export function createHost(service: random.Random, context: $wcm.Context): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.Context): random.Random {
			return $wcm.Service.create<random.Random>(functions, resources, wasmInterface, context);
		}
	}
}