'use client'
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs"
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const PRO_LIMIT=20;
const FREE_LIMIT=2;

function useSubscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState(null)   
    const [isOverFileLimit, setIsOverFileLimit] = useState(false)
    const {user}=useUser();

    // Listen to the user document..
    const [snapshot, loading, error]=useDocument(user && doc(db, "users", user.id), {
        snapshotListenOptions: { includeMetadataChanges: true },
    });
  
    // listen to the files collection
    const [filesSnapshot, filesLoading]=useCollection(user && collection(db, "users", user.id, "files"), {
        snapshotListenOptions: { includeMetadataChanges: true },
    });

    useEffect(()=>{
        if(!snapshot) return;

        const data=snapshot.data();
        if(!data) return;

        setHasActiveMembership(data.activeMembership);

    },[snapshot])


    useEffect(()=>{
// This type we are checking whether it is false and loading state of hasActiveMembership
        if(!filesSnapshot || hasActiveMembership===null) return;

        const userDocs=filesSnapshot.docs;

        const usersLimit=hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

        setIsOverFileLimit(userDocs.length>=usersLimit);




    },[filesSnapshot, PRO_LIMIT, FREE_LIMIT, hasActiveMembership])


    return {isOverFileLimit, hasActiveMembership, loading, filesLoading}

}
export default useSubscription