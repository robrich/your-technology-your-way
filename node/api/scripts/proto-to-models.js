import { join, dirname, delimiter } from 'path';
import shell from 'shelljs';
import rimraf from 'rimraf';
import { fileURLToPath } from 'url';

// thanks https://github.com/CatsMiaow/node-grpc-typescript

const __dirname = dirname(fileURLToPath(import.meta.url));
// https://github.com/shelljs/shelljs/issues/469
process.env.PATH += (delimiter + join(process.cwd(), 'node_modules', '.bin'));

const PROTO_DIR = join(__dirname, '../protos');
const MODEL_DIR = join(__dirname, '../src/models');
const PROTOC_PATH = join(__dirname, '../node_modules/grpc-tools/bin/protoc');
const PLUGIN_PATH = join(__dirname, '../node_modules/.bin/protoc-gen-ts_proto');

rimraf.sync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
});

const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,

  // https://github.com/stephenh/ts-proto/blob/main/README.markdown
  '--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true',

  `--ts_proto_out=${MODEL_DIR}`,
  `--proto_path ${PROTO_DIR} ${PROTO_DIR}/*.proto`,
];
// https://github.com/stephenh/ts-proto#usage
shell.exec(`${PROTOC_PATH} ${protoConfig.join(' ')}`, (code, stdout, stderr) => {
  console.log(stdout, stderr);
  process.exit(code);
});
