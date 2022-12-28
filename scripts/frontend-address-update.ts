import fs from 'fs';
import { config } from 'hardhat';
import { DeployNetwork } from './deploy-contract';
import packageJson from '../package.json';

const addressFile = `${config.paths.artifacts}/contracts/contractAddresses.ts`;
const logFile = `${__dirname}/deployment-logs.csv`;
const findAddressLine = (network: string) => new RegExp(`^.*\\s${network}\\s.*\n`, 'm');
const writeAddressLine = (network: string, address: string) => `export const ${network} = '${address}'\n`;

export function frontendAddressUpdate(network: string, address: string, testRun?: boolean) {
  if (!fs.existsSync(addressFile)) {
    fs.writeFileSync(addressFile, '');
  }

  const file = fs.readFileSync(addressFile, 'utf-8').toString();

  const findOldLine = findAddressLine(network);
  const newLine = writeAddressLine(network, address);
  const found = findOldLine.test(file);

  const updatedFile = found ? file.replace(findOldLine, newLine) : `${file}${newLine}`

  if (!testRun) {
    fs.writeFileSync(addressFile, updatedFile);
  }

  console.log(`Entry ${found ? 'updated' : 'added'}: ${network} - ${address}`)

  if (!testRun && network !== DeployNetwork.Localhost) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}, ${network}, ${address}, ${packageJson.version}`;
    fs.appendFileSync(logFile, logEntry);

    console.log(`Logged: ${timestamp} - ${network} - ${address} - ${packageJson.version}`)
  }
}
