/* @copyright Itential, LLC 2019 (pre-modifications) */

/* eslint import/no-dynamic-require: warn */
/* eslint object-curly-newline: warn */

// Set globals
/* global log */

/* Required libraries.  */
const path = require('path');

/* Fetch in the other needed components for the this Adaptor */
const AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));

const applicationKey = 'APPKEY163319793808674';
const XLevel3DigestTime = 1432842057812;
const XLevel3Digest = "WRqGp7y82cEPaKjJFFotWS4xJih6Atr7BwrbtlaXCxc=";

/**
 * This is the adapter/interface into DscV4
 */

/* GENERAL ADAPTER FUNCTIONS */
class DscV4 extends AdapterBaseCl {
  /**
   * DscV4 Adapter
   * @constructor
   */
  /* Working on changing the way we do Emit methods due to size and time constrainsts
  constructor(prongid, properties) {
    // Instantiate the AdapterBase super class
    super(prongid, properties);

    const restFunctionNames = this.getWorkflowFunctions();

    // Dynamically bind emit functions
    for (let i = 0; i < restFunctionNames.length; i += 1) {
      // Bind function to have name fnNameEmit for fnName
      const version = restFunctionNames[i].match(/__v[0-9]+/);
      const baseFnName = restFunctionNames[i].replace(/__v[0-9]+/, '');
      const fnNameEmit = version ? `${baseFnName}Emit${version}` : `${baseFnName}Emit`;
      this[fnNameEmit] = function (...args) {
        // extract the callback
        const callback = args[args.length - 1];
        // slice the callback from args so we can insert our own
        const functionArgs = args.slice(0, args.length - 1);
        // create a random name for the listener
        const eventName = `${restFunctionNames[i]}:${Math.random().toString(36)}`;
        // tell the calling class to start listening
        callback({ event: eventName, status: 'received' });
        // store parent for use of this context later
        const parent = this;
        // store emission function
        const func = function (val, err) {
          parent.removeListener(eventName, func);
          parent.emit(eventName, val, err);
        };
        // Use apply to call the function in a specific context
        this[restFunctionNames[i]].apply(this, functionArgs.concat([func])); // eslint-disable-line prefer-spread
      };
    }

    // Uncomment if you have things to add to the constructor like using your own properties.
    // Otherwise the constructor in the adapterBase will be used.
    // Capture my own properties - they need to be defined in propertiesSchema.json
    // if (this.allProps && this.allProps.myownproperty) {
    //   mypropvariable = this.allProps.myownproperty;
    // }
  }
  */

  /**
   * @callback healthCallback
   * @param {Object} reqObj - the request to send into the healthcheck
   * @param {Callback} callback - The results of the call
   */
  healthCheck(reqObj, callback) {
    // you can modify what is passed into the healthcheck by changing things in the newReq
    let newReq = null;
    if (reqObj) {
      newReq = Object.assign(...reqObj);
    }
    super.healthCheck(newReq, callback);
  }

  /**
   * @getWorkflowFunctions
   */
  getWorkflowFunctions(inIgnore) {
    let myIgnore = [];
    if (!inIgnore && Array.isArray(inIgnore)) {
      myIgnore = inIgnore;
    } else if (!inIgnore && typeof inIgnore === 'string') {
      myIgnore = [inIgnore];
    }

    // The generic adapter functions should already be ignored (e.g. healthCheck)
    // you can add specific methods that you do not want to be workflow functions to ignore like below
    // myIgnore.push('myMethodNotInWorkflow');

    return super.getWorkflowFunctions(myIgnore);
  }

  /**
   * updateAdapterConfiguration is used to update any of the adapter configuration files. This
   * allows customers to make changes to adapter configuration without having to be on the
   * file system.
   *
   * @function updateAdapterConfiguration
   * @param {string} configFile - the name of the file being updated (required)
   * @param {Object} changes - an object containing all of the changes = formatted like the configuration file (required)
   * @param {string} entity - the entity to be changed, if an action, schema or mock data file (optional)
   * @param {string} type - the type of entity file to change, (action, schema, mock) (optional)
   * @param {string} action - the action to be changed, if an action, schema or mock data file (optional)
   * @param {Callback} callback - The results of the call
   */
  updateAdapterConfiguration(configFile, changes, entity, type, action, callback) {
    const origin = `${this.id}-adapter-updateAdapterConfiguration`;
    log.trace(origin);
    super.updateAdapterConfiguration(configFile, changes, entity, type, action, callback);
  }

  /**
   * See if the API path provided is found in this adapter
   *
   * @function findPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  findPath(apiPath, callback) {
    const origin = `${this.id}-adapter-findPath`;
    log.trace(origin);
    super.findPath(apiPath, callback);
  }

  /**
    * @summary Suspends adapter
    *
    * @function suspend
    * @param {Callback} callback - callback function
    */
  suspend(mode, callback) {
    const origin = `${this.id}-adapter-suspend`;
    log.trace(origin);
    try {
      return super.suspend(mode, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Unsuspends adapter
    *
    * @function unsuspend
    * @param {Callback} callback - callback function
    */
  unsuspend(callback) {
    const origin = `${this.id}-adapter-unsuspend`;
    log.trace(origin);
    try {
      return super.unsuspend(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Get the Adaoter Queue
    *
    * @function getQueue
    * @param {Callback} callback - callback function
    */
  getQueue(callback) {
    const origin = `${this.id}-adapter-getQueue`;
    log.trace(origin);
    return super.getQueue(callback);
  }

  /**
  * @summary Runs troubleshoot scripts for adapter
  *
  * @function troubleshoot
  * @param {Object} props - the connection, healthcheck and authentication properties
  *
  * @param {boolean} persistFlag - whether the adapter properties should be updated
  * @param {Callback} callback - The results of the call
  */
  troubleshoot(props, persistFlag, callback) {
    const origin = `${this.id}-adapter-troubleshoot`;
    log.trace(origin);
    try {
      return super.troubleshoot(props, persistFlag, this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs healthcheck script for adapter
    *
    * @function runHealthcheck
    * @param {Adapter} adapter - adapter instance to troubleshoot
    * @param {Callback} callback - callback function
    */
  runHealthcheck(callback) {
    const origin = `${this.id}-adapter-runHealthcheck`;
    log.trace(origin);
    try {
      return super.runHealthcheck(this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs connectivity check script for adapter
    *
    * @function runConnectivity
    * @param {Callback} callback - callback function
    */
  runConnectivity(callback) {
    const origin = `${this.id}-adapter-runConnectivity`;
    log.trace(origin);
    try {
      return super.runConnectivity(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs basicGet script for adapter
    *
    * @function runBasicGet
    * @param {Callback} callback - callback function
    */
  runBasicGet(callback) {
    const origin = `${this.id}-adapter-runBasicGet`;
    log.trace(origin);
    try {
      return super.runBasicGet(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
   * @summary moves entites into Mongo DB
   *
   * @function moveEntitiesToDB
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                                  or the error
   */
  moveEntitiesToDB(callback) {
    const origin = `${this.id}-adapter-moveEntitiesToDB`;
    log.trace(origin);
    try {
      return super.moveEntitiesToDB(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Determines if this adapter supports the specific entity
   *
   * @function hasEntity
   * @param {String} entityType - the entity type to check for
   * @param {String/Array} entityId - the specific entity we are looking for
   *
   * @param {Callback} callback - An array of whether the adapter can has the
   *                              desired capability or an error
   */
  hasEntity(entityType, entityId, callback) {
    const origin = `${this.id}-adapter-hasEntity`;
    log.trace(origin);

    // Make the call -
    // verifyCapability(entityType, actionType, entityId, callback)
    return this.verifyCapability(entityType, null, entityId, callback);
  }

  /**
   * @summary Provides a way for the adapter to tell north bound integrations
   * whether the adapter supports type, action and specific entity
   *
   * @function verifyCapability
   * @param {String} entityType - the entity type to check for
   * @param {String} actionType - the action type to check for
   * @param {String/Array} entityId - the specific entity we are looking for
   *
   * @param {Callback} callback - An array of whether the adapter can has the
   *                              desired capability or an error
   */
  verifyCapability(entityType, actionType, entityId, callback) {
    const meth = 'adapterBase-verifyCapability';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    // if caching
    if (this.caching) {
      // Make the call - verifyCapability(entityType, actionType, entityId, callback)
      return this.requestHandlerInst.verifyCapability(entityType, actionType, entityId, (results, error) => {
        if (error) {
          return callback(null, error);
        }

        // if the cache needs to be updated, update and try again
        if (results && results[0] === 'needupdate') {
          switch (entityType) {
            case 'template_entity': {
              // if the cache is invalid, update the cache
              return this.getEntities(null, null, null, null, (data, err) => {
                if (err) {
                  const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Could not update entity: $VARIABLE$, cache', [entityType], null, null, null);
                  log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
                  return callback(null, errorObj);
                }

                // need to check the cache again since it has been updated
                return this.requestHandlerInst.verifyCapability(entityType, actionType, entityId, (vcapable, verror) => {
                  if (verror) {
                    return callback(null, verror);
                  }

                  return this.capabilityResults(vcapable, callback);
                });
              });
            }
            default: {
              // unsupported entity type
              const result = [false];

              // put false in array for all entities
              if (Array.isArray(entityId)) {
                for (let e = 1; e < entityId.length; e += 1) {
                  result.push(false);
                }
              }

              return callback(result);
            }
          }
        }

        // return the results
        return this.capabilityResults(results, callback);
      });
    }

    // if no entity id
    if (!entityId) {
      // need to check the cache again since it has been updated
      return this.requestHandlerInst.verifyCapability(entityType, actionType, null, (vcapable, verror) => {
        if (verror) {
          return callback(null, verror);
        }

        return this.capabilityResults(vcapable, callback);
      });
    }

    // if not caching
    switch (entityType) {
      case 'template_entity': {
        // need to get the entities to check
        return this.getEntities(null, null, null, null, (data, err) => {
          if (err) {
            const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Could not update entity: $VARIABLE$, cache', [entityType], null, null, null);
            log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
            return callback(null, errorObj);
          }

          // need to check the cache again since it has been updated
          return this.requestHandlerInst.verifyCapability(entityType, actionType, null, (vcapable, verror) => {
            if (verror) {
              return callback(null, verror);
            }

            // is the entity in the list?
            const isEntity = this.entityInList(entityId, data.response, callback);
            const res = [];

            // not found
            for (let i = 0; i < isEntity.length; i += 1) {
              if (vcapable) {
                res.push(isEntity[i]);
              } else {
                res.push(false);
              }
            }

            return callback(res);
          });
        });
      }
      default: {
        // unsupported entity type
        const result = [false];

        // put false in array for all entities
        if (Array.isArray(entityId)) {
          for (let e = 1; e < entityId.length; e += 1) {
            result.push(false);
          }
        }

        return callback(result);
      }
    }
  }

  /**
   * @summary Updates the cache for all entities by call the get All entity method
   *
   * @function updateEntityCache
   *
   */
  updateEntityCache() {
    const origin = `${this.id}-adapter-updateEntityCache`;
    log.trace(origin);

    if (this.caching) {
      // if the cache is invalid, update the cache
      this.getEntities(null, null, null, null, (data, err) => {
        if (err) {
          log.trace(`${origin}: Could not load template_entity into cache - ${err}`);
        }
      });
    }
  }

  /**
   * Makes the requested generic call
   *
   * @function genericAdapterRequest
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (uriPath === undefined || uriPath === null || uriPath === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['uriPath'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (restMethod === undefined || restMethod === null || restMethod === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['restMethod'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // remove any leading / and split the uripath into path variables
    let myPath = uriPath;
    while (myPath.indexOf('/') === 0) {
      myPath = myPath.substring(1);
    }
    const pathVars = myPath.split('/');
    const queryParamsAvailable = queryData;
    const queryParams = {};
    const bodyVars = requestBody;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      uriOptions: {},
      addlHeaders: {
        'X-level3-application-key': applicationKey,
        'X-Level3-Digest-Time': XLevel3DigestTime,
        'X-Level3-Digest': XLevel3Digest
      }
    };
    // add headers if provided
    if (addlHeaders) {
      reqObj.addlHeaders = addlHeaders;
    }

    // determine the call and return flag
    let action = 'getGenerics';
    let returnF = true;
    if (restMethod.toUpperCase() === 'POST') {
      action = 'createGeneric';
    } else if (restMethod.toUpperCase() === 'PUT') {
      action = 'updateGeneric';
    } else if (restMethod.toUpperCase() === 'PATCH') {
      action = 'patchGeneric';
    } else if (restMethod.toUpperCase() === 'DELETE') {
      action = 'deleteGeneric';
      returnF = false;
    }

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('.generic', action, reqObj, returnF, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['genericAdapterRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occurred
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occurred
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occurred
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occurred
   */

  /**
   * @function getUNISUsingGETV4
   * @pronghornType method
   * @name getUNISUsingGETV4
   * @summary getUNISUsingGETV4
   *
   * @param {number} [pageIndex] - default is 0
   * @param {number} [pageSize] - default is 1500
   * @param {string} [status] - you can specify comma separated list of status. valid values are active,inactive,pending,ineligible.

If none specified default response includes only active unis
   * @param {string} [serviceAddress] - physical address of an UNI
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getUNISUsingGETV4
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUNISUsingGETV4(pageIndex, pageSize, status, serviceAddress, callback) {
    const meth = 'adapter-getUNISUsingGETV4';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { pageIndex, pageSize, status, serviceAddress };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { xBillingAccountNumber: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UNISAPIs', 'getUNISUsingGETV4', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUNISUsingGETV4'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getUNIUsingGETV4
   * @pronghornType method
   * @name getUNIUsingGETV4
   * @summary getUNIUsingGETV4
   *
   * @param {string} id - id of the uni
   * @param {string} [cos] - cos . Accepted values are basic, enhanced, dedicated
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getUNIUsingGETV4
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUNIUsingGETV4(id, cos, callback) {
    const meth = 'adapter-getUNIUsingGETV4';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { cos };
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { xBillingAccountNumber: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UNISAPIs', 'getUNIUsingGETV4', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUNIUsingGETV4'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function v4getPartnerInterconnectsUsingGET
   * @pronghornType method
   * @name v4getPartnerInterconnectsUsingGET
   * @summary V4getPartnerInterconnectsUsingGET
   *
   * @param {number} [pageIndex] - default is 0
   * @param {number} [pageSize] - default is 1500
   * @param {string} [region] - represents a cloud provider region e.g for aws-hosted-connection and aws-hosted-vif &#39;us-west-2&#39;, for azure and azure-gov &#39;New York&#39; , for google-interconnect &#39;us-east1&#39;, ...(description truncated)
   * @param {string} [provider] - you can specify comma separated list of provider. valid values are aws-hosted-connection, aws-hosted-vif, azure, azure-gov, google-interconnect, ibm-directlink-connection...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /v4getPartnerInterconnectsUsingGET
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  v4getPartnerInterconnectsUsingGET(pageIndex, pageSize, region, provider, callback) {
    const meth = 'adapter-v4getPartnerInterconnectsUsingGET';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { pageIndex, pageSize, region, provider };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PARTNERINTERCONNECTSAPIs', 'v4getPartnerInterconnectsUsingGET', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['v4getPartnerInterconnectsUsingGET'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = DscV4;
