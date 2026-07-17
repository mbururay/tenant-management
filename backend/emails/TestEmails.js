import React from "react";

import {
    Html,
    Body,
    Container,
    Text
}
from "@react-email/components";

const TestEmails = ({ url }) => (
    React.createElement(
        Html,
        null,
        React.createElement(
            Body,
            null,
            React.createElement(
                Container,
                null,
                React.createElement(
                    Text,
                    null,
                    "Hello"
                )
            )
        )
    )
);

export default TestEmails;