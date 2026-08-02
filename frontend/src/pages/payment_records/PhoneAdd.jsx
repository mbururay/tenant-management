import { useState } from "react";
import Heading from "../../components/Heading";
import { authHeaders } from "../../api";
import { useNavigate } from "react-router-dom";
import "./PhoneAdd.css";

const PhoneAdd = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const [search, setSearch] = useState("");
    const [phone, setPhone] = useState("");

    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const searchTenant = async () => {

        if (!search.trim()) {
            alert("Enter a tenant name.");
            return;
        }

        

        try {

            const res = await fetch(
                `${API_URL}/searchTenantByName/${encodeURIComponent(search)}`
            );

            const data = await res.json();

            setResults(data);

        } catch (err) {

            console.error(err);
            alert("Search failed.");

        }

    };
    const normalizePhone = (phone) => {

    let number = phone.trim();

    if (!number) return null;

    // Remove spaces, dashes, brackets
    number = number.replace(/[\s()-]/g, "");

    // Kenyan local: 0712345678
    if (/^0\d{9}$/.test(number)) {
        return "254" + number.slice(1);
    }

    // Kenyan local: 712345678
    if (/^7\d{8}$/.test(number)) {
        return "254" + number;
    }

    // International with +
    if (/^\+\d{8,15}$/.test(number)) {
        return number.substring(1);
    }

    // International without +
    if (/^\d{8,15}$/.test(number)) {
        return number;
    }

    return null;

    };

    const addPhone = async (tenantId) => {

        if (!phone.trim()) {
            alert("Please enter a phone number.");
            return;
        }


    const formatted = normalizePhone(phone);

    try {

        const res = await fetch(
            `${API_URL}/phone`,
            {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    tenantId,
                    phone: formatted
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || data.error);
            return;
        }

        // Continue directly to payment page
        navigate(`/TenantPayUpdate/${tenantId}`);

    } catch (err) {

        console.error(err);
        alert("Failed to add phone.");

    }

};

    return (

        <div className="addPhonePage">

            <Heading />

            <div className="addPhoneContainer">

                <h1>Add Phone Number</h1>

                <p className="addPhoneSubtitle">
                    Search for an existing tenant, then attach the new phone number.
                </p>

                <div className="searchRow">

                    <input
                        type="text"
                        placeholder="Tenant name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="searchBtn"
                        onClick={searchTenant}
                    >
                        Search
                    </button>

                </div>

                <input
                    className="phoneInput"
                    type="text"
                    placeholder="Phone Number (e.g. +254712345678 or +1 817 555 1234)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <div className="results">

                    {results.length === 0 ? (

                        <p className="noResults">
                            Search for a tenant to continue.
                        </p>

                    ) : (

                        results.map((t) => (

                            <div
                                key={t.id}
                                className="tenantnameCard"
                            >

                                <div className="tenantInfo">

                                    <h3>{t.name}</h3>

                                    <p>
                                        House {t.houseno}
                                    </p>

                                </div>

                                <button
                                    className="addPhoneBtn"
                                    onClick={() => addPhone(t.id)}
                                >
                                    Add Phone
                                </button>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

};

export default PhoneAdd;