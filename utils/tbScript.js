/* eslint no-console: warn */
/* eslint import/no-unresolved: warn */
/* eslint global-require: warn */

// suppress eslint rule in adapter
/* eslint arrow-parens: warn */
/* eslint import/no-extraneous-dependencies: warn */
/* eslint import/no-dynamic-require: warn */

const path = require('path');
const program = require('commander');
const rls = require('readline-sync');
const utils = require('./tbUtils');
const basicGet = require('./basicGet');
const { name } = require('../package.json');
const sampleProperties = require('../sampleProperties.json');
const adapterPronghorn = require('../pronghorn.json');
const { addAuthInfo } = require('./addAuth');

const { troubleshoot, offline } = require('./troubleshootingAdapter');

const main = async (command) => {
  const dirname = utils.getDirname();
  const iapDir = path.join(dirname, '../../../../');
  if (!utils.withinIAP(iapDir)) {
    if (command === 'install') {
      console.log('Not currently in IAP directory - installation not possible');
      process.exit(0);
    } else if (command === 'connectivity') {
      const { host } = sampleProperties.properties;
      console.log(`perform networking diagnositics to ${host}`);
      await utils.runConnectivity(host);
      process.exit(0);
    } else if (command === 'healthcheck') {
      const a = basicGet.getAdapterInstance({ properties: sampleProperties });
      await utils.healthCheck(a);
      process.exit(0);
    } else if (command === 'basicget') {
      await utils.runBasicGet();
      process.exit(0);
    }
    if (rls.keyInYN('Troubleshooting without IAP?')) {
      await offline();
    }
    process.exit(0);
  }

  if (command === undefined) {
    await troubleshoot({}, true, true);
  } else if (command === 'install') {
    const { database, serviceItem, pronghornProps } = await utils.getAdapterConfig();
    const filter = { id: pronghornProps.id };
    const profileItem = await database.collection(utils.IAP_PROFILES_COLLECTION).findOne(filter);
    if (!profileItem) {
      console.log(`Could not find IAP profile for id ${pronghornProps.id}`);
      process.exit(0);
    }
    if (serviceItem) {
      console.log(`A service by the name ${name} already exits!`);
      if (rls.keyInYN(`Do you want to completely remove ${name}?`)) {
        console.log(`Removing ${name} from db...`);
        await database.collection(utils.SERVICE_CONFIGS_COLLECTION).deleteOne({ model: name });
        console.log(`${name} removed from db.`);
        if (profileItem.services.includes(serviceItem.name)) {
          const serviceIndex = profileItem.services.indexOf(serviceItem.name);
          profileItem.services.splice(serviceIndex, 1);
          const update = { $set: { services: profileItem.services } };
          await database.collection(utils.IAP_PROFILES_COLLECTION).updateOne(
            { id: pronghornProps.id }, update
          );
          console.log(`${serviceItem.name} removed from profileItem.services.`);
          console.log(`Rerun the script to reinstall ${serviceItem.name}.`);
          process.exit(0);
        } else {
          process.exit(0);
        }
      } else {
        console.log('Exiting...');
        process.exit(0);
      }
    } else {
      utils.verifyInstallationDir(dirname, name);
      utils.runTest();
      if (rls.keyInYN(`Do you want to install ${name} to IAP?`)) {
        console.log('Creating database entries...');
        const adapter = utils.createAdapter(
          pronghornProps, profileItem, sampleProperties, adapterPronghorn
        );

        adapter.properties.properties = await addAuthInfo(adapter.properties.properties);

        await database.collection(utils.SERVICE_CONFIGS_COLLECTION).insertOne(adapter);
        profileItem.services.push(adapter.name);
        const update = { $set: { services: profileItem.services } };
        await database.collection(utils.IAP_PROFILES_COLLECTION).updateOne(
          { id: pronghornProps.id }, update
        );
        console.log('Database entry creation complete.');
      }
      console.log('Exiting...');
      process.exit(0);
    }
  } else if (['healthcheck', 'basicget', 'connectivity'].includes(command)) {
    const { serviceItem } = await utils.getAdapterConfig();
    if (serviceItem) {
      const adapter = serviceItem;
      const a = basicGet.getAdapterInstance(adapter);
      if (command === 'healthcheck') {
        await utils.healthCheck(a);
        process.exit(0);
      } else if (command === 'basicget') {
        await utils.runBasicGet(true);
      } else if (command === 'connectivity') {
        const { host } = adapter.properties.properties;
        console.log(`perform networking diagnositics to ${host}`);
        await utils.runConnectivity(host, true);
        process.exit(0);
      }
    } else {
      console.log(`${name} not installed. Run npm \`run install:adapter\` to install.`);
      process.exit(0);
    }
  }
};

program
  .command('connectivity')
  .alias('c')
  .description('networking diagnostics')
  .action(() => {
    main('connectivity');
  });

program
  .command('install')
  .alias('i')
  .description('install current adapter')
  .action(() => {
    main('install');
  });

program
  .command('healthcheck')
  .alias('hc')
  .description('perfom none interative healthcheck with current setting')
  .action(() => {
    main('healthcheck');
  });

program
  .command('basicget')
  .alias('bg')
  .description('perfom basicget')
  .action(() => {
    main('basicget');
  });

// Allow commander to parse `process.argv`
program.parse(process.argv);

if (process.argv.length < 3) {
  main();
}
const allowedParams = ['install', 'healthcheck', 'basicget', 'connectivity'];
if (process.argv.length === 3 && !allowedParams.includes(process.argv[2])) {
  console.log(`unknown parameter ${process.argv[2]}`);
  console.log('try `node troubleshootingAdapter.js -h` to see allowed parameters. Exiting...');
  process.exit(0);
}
