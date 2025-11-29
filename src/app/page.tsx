'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash, ListChecks, Sigma, LoaderCircle } from 'lucide-react';
import EditTask from '@/components/edit-taks';
import ClearTask from '@/components/clear-taks';
import { getTasks } from '@/actions/get-task-from-db';
import { useEffect, useState, useMemo } from 'react';
import { Tasks } from '@/generated/prisma/client';
import { NewTask } from '@/actions/add-task';
import { deleteTask } from '@/actions/delete-task';
import { toast } from 'sonner';
import { updateTasksStatus } from '@/actions/toggle-done';
import Filter from '@/components/filter';
import { FilterType } from '@/components/filter';
import { deleteCompletedTasks } from '@/actions/delete-completed-tasks';

const Home = () => {
  const [taskList, setTaskList] = useState<Tasks[]>([]);
  const [task, setTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks();
      if (!tasks) return;
      setTaskList(tasks);
    } catch (error) {
      throw error;
    }
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      if (task.length === 0 || !task) {
        toast.error('Preencha o campo antes de ADICIONAR!');
        setLoading(false);
        return;
      }

      const myNewTask = await NewTask(task);

      if (!myNewTask) return;

      setTask('');
      toast.success('Atividade ADICIONADA com sucesso!');
      await handleGetTasks();
    } catch (error) {
      throw error;
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return;
      const deletedTask = await deleteTask(id);

      if (!deletedTask) return;
      await handleGetTasks();
      toast.warning('A sua tarefa foi EXCLUÍDA!');
    } catch (error) {
      throw error;
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];

    try {
      console.log(previousTasks);
      setTaskList((prev) => {
        const updatedTaskList = prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              done: !task.done,
            };
          } else {
            return task;
          }
        });

        return updatedTaskList;
      });

      await updateTasksStatus(taskId);
    } catch (error) {
      setTaskList(previousTasks);
      throw error;
    }
  };

  const clearCompletedTasks = async () => {
    const deletedTasks = await deleteCompletedTasks()

    if (!deletedTasks) return

    setTaskList(deletedTasks)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGetTasks();
  }, []);

  const filteredTasks = useMemo(() => {
  switch (currentFilter) {
    case "pending":
      return taskList.filter(task => !task.done);

    case "completed":
      return taskList.filter(task => task.done);

    case "all":
    default:
      return taskList;
  }
}, [taskList, currentFilter]);

  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg">
        <CardHeader className="flex gap-2">
          <Input
            placeholder="Adicionar tarefa..."
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <Button className="cursor-pointer" onClick={handleAddTask}>
            {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
            Adicionar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />

          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />

          <div className="mt-4 border-b-2">
            {taskList.length === 0 && (
              <p className="text-sm border-t py-4">
                Você não possui tarefas cadastradas!
              </p>
            )}
            {filteredTasks.map((task) => (
              <div
                className="h-14 flex justify-between items-center border-t-2"
                key={task.id}
              >
                <div
                  className={`${
                    task.done
                      ? 'w-2 h-full bg-green-400'
                      : 'w-2 h-full bg-red-400'
                  }`}
                ></div>
                <p
                  className="flex-1 px-2 text-sm cursor-pointer hover:text-gray-400 transition-all duration-300"
                  onClick={() => handleToggleTask(task.id)}
                >
                  {' '}
                  {task.task}{' '}
                </p>
                <div className="flex items-center gap-2">
                  <EditTask task={task} handleGetTasks={handleGetTasks} />
                  <Trash
                    className="cursor-pointer"
                    size={16}
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListChecks size={18} />
              <p className="text-xs">Tarefas Concluídas ({ taskList.filter(task => task.done).length }/{ taskList.length })</p>
            </div>
            <ClearTask clearCompletedTasks={clearCompletedTasks}/>
          </div>

          <div className="h-2 w-full bg-gray-100 mt-4 rounded-md">
            <div
              className="h-full bg-blue-500 rounded-md"
              style={{ width: `${((taskList.filter(task => task.done).length) / taskList.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2 font-bold">
            <Sigma size={18} />
            <p className="text-xs">{ taskList.length } tarefas no total</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
