'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState, useFormStatus } from 'react-dom'
import { UseFormReturn, useForm } from 'react-hook-form'
import { z } from 'zod'

import { formSchema } from './formSchema'
import { handleTest } from './handleTest'

const FormContent = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  const { pending } = useFormStatus()

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>message</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>Message to send to server</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
      {pending && 'loading...'}
    </Form>
  )
}

export function TestForm() {
  const [state] = useFormState(handleTest, null) // state contains the returned state from server

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
    reValidateMode: 'onBlur',
  })

  return (
    <form
      action={async (e: FormData) => {
        const valid = await form.trigger()
        if (valid) {
          handleTest(null, form.getValues())
        }
      }}
      className="space-y-8"
    >
      <FormContent form={form} />
    </form>
  )
}
