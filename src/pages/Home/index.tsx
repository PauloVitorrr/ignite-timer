import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from 'react'



import {CountdownContainer,
        FormContainer, 
        HomeContainer, 
        MinutesAmountInput, 
        Separator, 
        StartCountdownButton, 
        TaskInput } from './style'

const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
                .min(5, 'O interavalo mínimo precisa ser de 5 min')
                .max(60, 'O intervalo máximo precisa ser de 60 min')
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}


export function Home() {
  const [cycles, setCycles ] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  function handleCreateNewCycle(data: NewCycleFormData){
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset()
  }

  const activeCycle = cycles.find((cycle)=> cycle.id == activeCycleId)

  const task = watch('task')
  const isSubmitDisabled = !task

  return(
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou Trabalhar em</label>
          <TaskInput 
            id="task" 
            list="task-suggestions"
            placeholder='Dê um nome para o seu projeto'
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"/>
            <option value="Projeto 2"/>
            <option value="Proejto 3"/>
            <option value="Banana"/>
          </datalist>

          <label htmlFor="MinutesAmount">Durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount"
            placeholder='00'
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', {valueAsNumber: true})}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24}/>
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
