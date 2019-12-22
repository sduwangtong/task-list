import React from 'react';
import { Task, withDeleteTask, DeleteTaskMutationFn, TasksQuery, TasksQueryVariables, TasksDocument, TaskStatus } from '../generated/graphql';
import Link from 'next/link';
import { isApolloError } from 'apollo-boost';

interface ExposeProps {
  tasks: Task[];
}
interface MutationProps{
    deleteTask?: DeleteTaskMutationFn;
}

type AllPros = MutationProps & ExposeProps; 
const TaskList: React.FunctionComponent<AllPros> = ({ tasks, deleteTask }) => {
  const deleteById = async(id: number) => {
      if (deleteTask) {
          try {
              await deleteTask({
                  variables: {id},
                  update: (cache, result) => {
                    if (result.data && result.data.deleteTask) {
                      // do update after delte
                      // 1 query cache
                      const tasksCache = cache.readQuery<TasksQuery, TasksQueryVariables>({
                        query: TasksDocument,
                        variables: {status: TaskStatus.Active}
                      });
                      // update cache
                      if(tasksCache) {
                        cache.writeQuery<TasksQuery, TasksQueryVariables>({
                          query: TasksDocument,
                          variables: {status:TaskStatus.Active},
                          data:{
                            tasks: tasksCache.tasks.filter(task => task.id != id)
                          }
                        });
                      }
                    }
                  }
              })
          } catch(e) {
              if (isApolloError(e) && e.networkError) {
                alert("newtwork");
              } else {
                  alert("try aagin");
              }
          }
      }
  };
  return (
    <ul>
      {tasks.map(task => {
        return (
          <li key={task.id}>
            <div className="title"><Link href={{pathname:"/update", query:{id: task.id}}}><a>{task.title}</a></Link></div>
            <button
              className="deleteButton"
              onClick={() => deleteById(task.id)}
            >
              &times;
            </button>
          </li>
        );
      })}
      <style jsx>{`
        ul {
          list-style: none;
          margin: 0 0 30px;
          padding: 0;
        }
        li {
          align-items: center;
          border: 1px solid #dde5ff;
          display: flex;
          padding: 14px;
        }
        li + li {
          margin-top: -1px;
        }
        li:first-child {
          border-radius: 4px 4px 0 0;
        }
        li:last-child {
          border-radius: 0 0 4px 4px;
        }
        li:nth-child(odd) {
          background: #fcfdff;
        }
        .title {
          margin: 0 20px;
        }
        .title a {
            color: #5d647b;
            display: block;
          }
          .title a:hover {
            color: #7694f5;
          }
          .deleteButton {
          background: #dde5ff;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #7694f5;
          flex-shrink: 0;
          font-size: 12px;
          font-weight: bold;
          height: 20px;
          line-height: 18px;
          margin: 0 0 0 auto;
          outline: 0;
          padding: 0;
          text-align: center;
          width: 20px;
        }
        .deleteButton:hover {
          background: #7694f5;
          color: white;
        }
      `}</style>
    </ul>
  );
};

export default withDeleteTask<ExposeProps, MutationProps>({
    props: ({mutate}) => ({deleteTask: mutate})
})(TaskList);