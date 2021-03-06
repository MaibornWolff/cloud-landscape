import {Service, ServiceWithoutId} from '../assets/data/dataType';
import {
  RemoteMongoClient,
  Stitch,
  UserApiKeyCredential,
} from 'mongodb-stitch-browser-sdk';

const DATABASE = 'DynamicLandscape';
const COLLECTION = 'Services';

const client = Stitch.initializeDefaultAppClient('dynamiclandscape-kaewj');
const db = client
  .getServiceClient(RemoteMongoClient.factory, 'DynamicLandscape_Service')
  .db(DATABASE);

const credential = new UserApiKeyCredential(
  '7jcwcGl6aSKf0oSXiW8Wb8AbLZwFkr2YHSrHcSVnDWEhXektnxJ8TipzrkDucVbj'
);

export default async function fetchAllServices(
  force = false,
  adminCredentials?: string
) {
  const cache = sessionStorage.getItem('serviceContent');
  const createdBy = Number(sessionStorage.getItem('createdBy'));
  if (cache && !force && createdBy && createdBy + 86400000 > Date.now()) {
    return JSON.parse(cache);
  } else {
    let returnDoc = [] as Service[];
    await client.auth
      .loginWithCredential(
        adminCredentials
          ? new UserApiKeyCredential(adminCredentials)
          : credential
      )
      .then(() =>
        db
          .collection<Service>(COLLECTION)
          .find(adminCredentials ? {} : {status: 'published'})
          .toArray()
      )
      .then((docs: Service[]) => {
        console.log('[MongoDB Stitch] Connected to Stitch');
        returnDoc = docs;
        sessionStorage.setItem('serviceContent', JSON.stringify(returnDoc));
        sessionStorage.setItem('createdBy', Date.now().toString());
      })
      .catch((err: Error) => {
        console.error(err);
      });
    return returnDoc;
  }
}

export async function checkAdminCredentials(credentials: string) {
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() => client.callFunction('checkIsFrontendAdmin', []))
    .catch((err: Error) => {
      if (err.message === 'invalid API key') return false;
      console.error(err);
      return false;
    });
}

export async function uploadImage(
  credentials: string,
  path: string,
  image: ArrayBuffer
) {
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() => {
      client.callFunction('uploadImg', [path, image]);
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

export async function getAvailableImages(credentials: string) {
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() => client.callFunction('getAvailableImages', []))
    .then(response =>
      response.Contents.map((object: {Key: string}) => object.Key)
    );
}

export async function addNewService(
  credentials: string,
  service: ServiceWithoutId
) {
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() => db.collection<ServiceWithoutId>(COLLECTION).insertOne(service));
}

export async function deleteService(credentials: string, service: Service) {
  const {_id: id, ...serviceWithoutId} = service;
  serviceWithoutId.status = 'deleted';
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() =>
      db
        .collection<Service>(COLLECTION)
        .findOneAndReplace(
          {_id: {$oid: (id as string | object).toString()}},
          serviceWithoutId
        )
    );
}

export async function updateService(credentials: string, service: Service) {
  const {_id: id, ...serviceWithoutId} = service;
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() =>
      db
        .collection<Service>(COLLECTION)
        .findOneAndReplace(
          {_id: {$oid: (id as string | object).toString()}},
          serviceWithoutId
        )
    );
}

export async function createMongoDBBackup(credentials: string) {
  return await client.auth
    .loginWithCredential(new UserApiKeyCredential(credentials))
    .then(() => client.callFunction('backupMongoDB', []))
    .then(response =>
      alert(
        'MongoDB was successfully backuped to S3 with ' +
          response +
          ' services. (path: backup/serviceBackup_[DATE].json'
      )
    )
    .catch(e => {
      alert(e);
    });
}
