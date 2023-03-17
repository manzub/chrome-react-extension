import React, { useEffect } from "react";
import { FirebaseContext } from "../context/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { VaultItem } from "../types";

export default function useContent(target: string, owner: string) {
  const [content, setContent] = React.useState<VaultItem[]>([]);
  const firebaseContent = React.useContext(FirebaseContext);
  useEffect(() => {
    if (owner) {
      const q = query(collection(firebaseContent!.firestore, target), where('owner', '==', owner))
      onSnapshot(q, (snapshot) => {
        const allContent = snapshot.docs.map((contentObj) => {
          let data = contentObj.data();
          return {
            email: data.email, favIconUrl: data.favIconUrl,
            owner: data.owner, username: data.username,
            value: data.value, web_url: data.web_url,
            itemExists: data.itemExists || false, docId: contentObj.id
          }
        });
        setContent(allContent);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { [target]: content }
}