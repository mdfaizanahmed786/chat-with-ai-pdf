import {getApps, getApp, cert, App, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
let app:App;

const service_key=require('@/service_key.json')

if(getApps().length===0){

    app=initializeApp({
        credential:cert(service_key)
    })
}
else{
    app=getApp()
}

const adminDb=getFirestore(app)
const adminStorage=getStorage(app)

export {app as adminApp, adminDb, adminStorage}