import React, { useEffect } from "react";
import { FirebaseContext } from "../context/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function useContent(target, owner) {
  const [content, setContent] = React.useState([]);
  const { firestore } = React.useContext(FirebaseContext);

  useEffect(() => {
    const q = query(collection(firestore, target), where('owner', '==', owner))
    onSnapshot(q, (snapshot) => {
      const allContent = snapshot.docs.map((contentObj) => ({
        ...contentObj.data(),
        docId: contentObj.id
      }));
      setContent(allContent);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { [target]: content }
}