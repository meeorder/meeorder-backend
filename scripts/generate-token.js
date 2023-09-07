const { JwtService } = require('@nestjs/jwt');
const { Logger } = require('@nestjs/common');
const { Types } = require('mongoose');
const path = require('path');
const { readFileSync } = require('fs');

const logger = new Logger('GenerateToken');

function extractArgs() {
  const BEGINNING_ARGS = 2;
  const args = process.argv.slice(BEGINNING_ARGS);
  const r = /--(\w+)=([\w-]+)/;
  const result = {};
  for (const arg of args) {
    const [, key, value] = r.exec(arg);
    result[key] = value;
  }

  return result;
}

async function generate() {
  const {
    role = '100',
    id = new Types.ObjectId().toHexString(),
    username = 'meeorder-dev',
    file,
  } = extractArgs();
  const pathFile = file
    ? path.resolve(file)
    : path.resolve(__dirname, './meeorder-dev.key');
  logger.log('key file:', pathFile);
  const PRIVATE_KEY = readFileSync(pathFile, 'utf-8');
  const jwtService = new JwtService({
    privateKey: PRIVATE_KEY,
    signOptions: {
      algorithm: 'ES256',
    },
  });

  const user = {
    id,
    username,
    role: +role,
  };
  await jwtService
    .signAsync(user, {
      expiresIn: '100y',
    })
    .then(console.log);
}

generate();
