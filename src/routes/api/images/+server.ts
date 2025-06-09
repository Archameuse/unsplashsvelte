import type { RequestHandler } from '@sveltejs/kit';
import {IMGUR_ID, FIREBASE_ACCOUNT} from '$env/static/private'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import admin from 'firebase-admin'
import axios from 'axios';

const SERVICE_ACCOUNT = JSON.parse(FIREBASE_ACCOUNT)

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData()
    const image = formData.get('image')
    const label = formData.get('label')
    if(!image&&!label) return new Response("No file or label provided", {status: 403})
    if(!admin.apps?.length&&SERVICE_ACCOUNT) {
        initializeApp({
            credential: cert(SERVICE_ACCOUNT),
        })
    }
    const db = getFirestore()
    const collection = db.collection('images')
    const resp = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
            'Authorization': 'Client-ID ' + IMGUR_ID,
            'Accept': 'application/json'
        },
        }).catch(err => {
            console.error(err)
            return new Response('Error uploading to axios',{status: 400})
        }) as {data:{data:{link:string,deletehash:string}}}
    if(!resp.data?.data?.link) return new Response("Error uploading to axios", {status:400})
    await collection.doc(resp.data.data.deletehash).set({
        label,
        link: resp.data.data.link,
    })
    return new Response(JSON.stringify({
        link: resp.data.data.link,
        id: resp.data.data.deletehash
    }), {
    headers: {
        'Content-Type': 'application/json'
    }
  });
};

export const GET: RequestHandler = async () => {
    if(!admin.apps?.length&&SERVICE_ACCOUNT) {
        initializeApp({
            credential: cert(SERVICE_ACCOUNT),
        })
    }
    const db = getFirestore()
    const collection = db.collection('images')
    const resp = (await collection.get()).docs.map(doc => {
        return {
            ...doc.data(),
            id: doc.id
        }
    })
    return new Response(JSON.stringify(resp), {
        status: 200
    });
}

export const DELETE: RequestHandler = async ({ request }) => {
    const body = await request.json()
    const { id } = body
    if(typeof id !== 'string') return new Response("No id provided", {status: 400})
    if(!admin.apps?.length&&SERVICE_ACCOUNT) {
        initializeApp({
            credential: cert(SERVICE_ACCOUNT),
        })
    }
    const db = getFirestore()
    const collection = db.collection('images')
    try {
        await axios.delete(`https://api.imgur.com/3/image/${id}`, {
        headers: {
            'Authorization': 'Client-ID ' + IMGUR_ID
        }})
        await collection.doc(id).delete()
        return new Response("Success", {
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 400
        });
    }
}