/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';

import { URI } from 'vscode-uri';
import runSingle from './tests';

runSingle((client, folder) => {
	const filename = path.join(folder.uri.fsPath, 'toDelete.txt');
	client.vscode.workspace.fileSystem.delete(URI.file(filename));
}).catch(console.error);
