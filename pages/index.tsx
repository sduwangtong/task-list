import React from 'react';
import { NextPage } from 'next';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

interface IntialProps {
    greeting: string;
}

interface Props extends IntialProps {

}

const taskQuery = gql`query Tasks($status: TaskStatus) {
    tasks(status: $status) {
      id
      title
      status
    }
  }`;
interface TasksQuery {
    tasks: {
        id: number;
        title: string;
        status: string;
    }[];
}

interface TasksQueryVariable {
    status: string;
}
const IndexPage: NextPage<Props, IntialProps> = props => {
    return (
    <Query<TasksQuery, TasksQueryVariable> query={taskQuery} variables={{status:"completed"}}> 
        {({loading, error, data}) => {
            if (loading) {
                return <p> loading </p>
            } else if (error) {
                return <p>error</p>
            } 
            const tasks = data && data.tasks ? data.tasks : [];
            
        
            return <ul> { tasks.map(task => {
                return <li key={task.id}> {task.title} </li>
            })}</ul>

        }}  
    </Query>
    );
};

IndexPage.getInitialProps = async() => ({
    greeting: "Hi"
});

export default IndexPage;