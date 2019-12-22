import React from 'react';
import { NextPage } from 'next';
import { Layout } from '../components/Layout';
import { TasksComponent, TaskStatus } from '../generated/graphql';
import { TaskList } from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';

interface IntialProps {
    greeting: string;
}

interface Props extends IntialProps {

}

const IndexPage: NextPage<Props, IntialProps> = props => {
    return (
        <Layout> 
            <TasksComponent variables={{status:TaskStatus.Active}}> 
                {({loading, error, data, refetch }) => {
                    if (loading) {
                        return <p> loading </p>
                    } else if (error) {
                        return <p>error</p>
                    } 
                    const tasks = data && data.tasks ? data.tasks : [];
                    
                
                    return (
                        <>
                            <CreateTaskForm onTaskCreated={refetch} />
                            <TaskList tasks={tasks}></TaskList>
                        </>
                    );
                }}  
            </TasksComponent>
        </Layout>
    );
};
export default IndexPage;