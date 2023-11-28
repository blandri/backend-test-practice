/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
import { Task } from '../../database/models'
import TaskServices from '../services/task.service';
const excelJS = require("exceljs");

config();

export default class TaskController {
  constructor() {
    this.userService = new TaskServices()
  }

  async createTask(req, res) {
    try {
        const { title, description, assignees, select_projects, start_date, end_date, priority, file_attachment  } = req.body

        const task = await new TaskServices().createTask({ 
          title, 
          description, 
          assignees,
          select_projects,
          start_date, 
          end_date, 
          priority, 
          file_attachment:file_attachment?.path
         })

      return res.status(201).json({
          message: 'Created task successfully',
          data: task
      });
    } catch (error) {
        return res.status(500).json({
            message: 'Error occured while creating the task',
            error: error.message
          });
    }
  }

  async getAllTasks(req, res) {
    try {
      const order = req.params.filter;
      const projects = await new TaskServices().getTasks(req.params.offset, order, req.params.limit)
      return res.status(200).json({
        message: 'Retrieved all tasks successfully',
        data: projects
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while retrieving aprojects',
        error: error.message
      });
    }
  }

  async updateTask(req, res) {
    try {
      const taskId = req.params.id
      const { title, description, assignees, select_projects, start_date, end_date, priority, file_attachment  } = req.body
      const task = await new TaskServices().updateTask({
        title, 
          description, 
          assignees,
          select_projects,
          start_date, 
          end_date, 
          priority, 
          file_attachment:file_attachment?.path
      }, taskId)
      return res.status(200).json({
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while deleting aprojects',
        error: error.message
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const task = await new TaskServices().destroyTask(taskId)
      return res.status(200).json({
        message: 'Task deleted successfully',
        data: task
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while retrieving aprojects',
        error: error.message
      });
    }
  }

  async downloadExcel (req, res) {
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("Tasks"); // New Worksheet
    const path = "../../Downloads";  // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
      { header: "S no.", key: "s_no", width: 10 },
      { header: "title", key: "title", width: 10 }, 
      { header: "description", key: "description", width: 10 },
      { header: "priority", key: "priority", width: 10 },
      { header: "Start date", key: "start_date", width: 10 },
      { header: "End date", key: "end_date", width: 10 },
      { header: "File", key: "file_attachment", width: 10 }
  ];

  const tasks = await new TaskServices().getTasks()

  // Looping through User data
  let counter = 1;
  tasks.rows.forEach((Task) => {
    Task.s_no = counter;
    worksheet.addRow(Task); // Add data in worksheet
    counter++;
  });
  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    const data = await workbook.xlsx.writeFile(`${path}/tasks.xlsx`)
     .then(() => {
       res.send({
         status: "success",
         message: "file successfully downloaded",
         path: `${path}/users.xlsx`,
        });
     });
  } catch (err) {console.log(err)
      res.send({
      status: "error",
      message: "Something went wrong",
    });
    }
  };
}
