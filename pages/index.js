
import Nav from "./components/Nav";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, getDocs , query, where} from "firebase/firestore"

async function getUnpaid(){
  const firebaseConfig = {
    apiKey: "AIzaSyDPGmgTxlAsVkakZrGbs8NTF2r0RcWu_ig",
    authDomain: "luminous-lambda-364207.firebaseapp.com",
    projectId: "luminous-lambda-364207",
    storageBucket: "luminous-lambda-364207.appspot.com",
    messagingSenderId: "518969290682",
    appId: "1:518969290682:web:d7be744cb378ec83d4f783"
  };
  initializeApp(firebaseConfig);
  const firestore = getFirestore()
  const colRef = collection(firestore,'units/10144-boca-entrada/payments')
  const q = query(colRef, where("status", "==", "unpaid"))
  let unpaid = [];
  await getDocs(q).then(snapshot => {
    snapshot.docs.forEach(doc => {unpaid.push({...doc.data(), id: doc.id});
    })
  })
  return unpaid
}

function getElements(props){
  // create 2D array, push address and autopay
  let elements = [["10144 boca entrada", "/", "title"], ["autopay","/autopay","autopay"]]
  // push unpaid payments
  for (let i in props.unpaid) {
    elements.push([props.unpaid[i].name, props.unpaid[i].url, "unpaid"])
  }
  // push log
  elements.push(["...", "/log", "log"])
  return elements
}

export async function getStaticProps() {
  let unpaid = await getUnpaid()
  return {
    props: { unpaid },
    revalidate: 1
  }
}

export default function Home(props) {
  let elements = getElements(props)
  return (
      <div>
        <Nav elements={elements}/>
      </div>
  )
}
