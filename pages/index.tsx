import React from 'react';
import { NextPage } from 'next';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Layout } from '../components/Layout';
import { TasksComponent, TaskStatus } from '../generated/graphql';
import { TaskList } from '../components/TaskList';

interface IntialProps {
    greeting: string;
}

interface Props extends IntialProps {

}

const IndexPage: NextPage<Props, IntialProps> = props => {
    return (
        <Layout> 
            <TasksComponent variables={{status:TaskStatus.Active}}> 
                {({loading, error, data}) => {
                    if (loading) {
                        return <p> loading </p>
                    } else if (error) {
                        return <p>error</p>
                    } 
                    const tasks = data && data.tasks ? data.tasks : [];
                    
                
                    return <TaskList tasks={tasks}></TaskList>;

                }}  
            </TasksComponent>
        </Layout>
    );
};
export default IndexPage;