

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { initializeApp } from "firebase/app";
import {getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, getDocs, query, where} from "firebase/firestore"

import CheckoutForm from "../components/CheckoutForm";
import Nav from "./components/Nav";

// Make sure to call loadStripe outside of a component’s render to avoid


export async function getStaticProps(context) {
    const firebaseConfig = {
        apiKey: "AIzaSyDPGmgTxlAsVkakZrGbs8NTF2r0RcWu_ig",
        authDomain: "luminous-lambda-364207.firebaseapp.com",
        projectId: "luminous-lambda-364207",
        storageBucket: "luminous-lambda-364207.appspot.com",
        messagingSenderId: "518969290682",
        appId: "1:518969290682:web:d7be744cb378ec83d4f783"
    };
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore()
    const colRef = collection(firestore,'units/10144-boca-entrada/payments')
    const q = query(colRef, where("status", "==", "unpaid"))
    let unpaid = [];
    await getDocs(q).then(snapshot => {
        snapshot.docs.forEach(doc => {
            unpaid.push({...doc.data(), id: doc.id});
        })
    })
    let paymentURL = context.params.payment
    return {
        props: { unpaid, paymentURL}
    }
}

export async function getStaticPaths() {
    return (
        {
            paths: [
                { params :{payment: 'deposit'}}, {params:{payment: 'august2022'}}
            ], fallback : true
        }
    )
}

// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51LlESTC3Ie0MSAM21CjKndOxCjSpqejUuXSIDiojSTvS1o7UqsZ1dI1fyHE1dgwwQecy1qPuy6j613F70wu0Z9yL00eNWxldcl");

export default function Payment(props) {
    const [clientSecret, setClientSecret] = React.useState("");

    React.useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };
    // create 2D array, push address and autopay
    let elements = [["<-----", "/", "title"], [" ","/autopay","autopay"]]
    // push unpaid payments
    for (let i in props.unpaid) {
        if (props.unpaid[i].url == props.paymentURL) {
            elements.push([props.unpaid[i].name + ": $" + props.unpaid[i].amount, "/", "august2025"])
            break;
        }
        elements.push([" ", props.unpaid[i].url, "unpaid"])
    }

    return (

        <div className="App">
            <Nav elements = {elements}/>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}