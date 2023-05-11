import { queryFetch } from "./fetch.js";

export async function div01CompletedTasksID() {
    try {
      const data = await queryFetch(`
        query getDiv01CompletedTasksID {
          progress {
            path
            object {
              id
            }
          }
        }
      `);
  
      if (!data.progress) {
        throw new Error('No progress data found in response');
      }
  
      const taskIDs = data.progress.map(task => task.object?.id);
  
      return taskIDs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  

  export async function div01TaskXP(user, taskID) {
    const query = `
      query getDiv01TaskXP {
        user {
          transaction {
            amount
            createdAt
            object {
              name
            }
          }
        }
      }
    `;
  

  
    
  }