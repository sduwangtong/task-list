import React from 'react';
import { NextPage } from 'next';

interface IntialProps {
    greeting: string;
}

interface Props extends IntialProps {

}
const IndexPage: NextPage<Props, IntialProps> = props => {
    return <div>{props.greeting}</div>;
};

IndexPage.getInitialProps = async() => ({
    greeting: "Hi"
});

export default IndexPage;