/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/* eslint-disable no-console */

import { RAL, Int64Result } from '../../api';
import { assertResult, runSingle } from './tests';

export function run(): void {
	runSingle((connection) => {
		const resultType = Int64Result.fromLength(64);
		const result = connection.sendRequest('int64array', resultType, 50);
		assertResult(result, resultType, 64, -1);
	}).catch(RAL().console.error);
}