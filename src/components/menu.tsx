'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { Menu as MenuIcon } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'

export const Menu = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1>App logo</h1>
        <MenuLinks />
      </div>
      <Separator orientation="horizontal" />
    </div>
  )
}

const MenuLinks = () => {
  const isDesktop = useMediaQuery({
    query: 'only screen and (max-width : 768px)',
  })

  const links = (
    <>
      <Link className="hover:underline" href="/1">
        Link 1
      </Link>
      <Link className="hover:underline" href="/2">
        Link 2
      </Link>
      <Link className="hover:underline" href="/3">
        Link 3
      </Link>
    </>
  )

  if (isDesktop) {
    return (
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="ghost">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[20rem] max-w-full rounded-none">
          <div className="p-4 pb-0 flex flex-col gap-2">{links}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  } else {
    return <div className="flex gap-4">{links}</div>
  }
}
