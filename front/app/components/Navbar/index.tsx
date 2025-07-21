import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Megaphone, Menu, Search } from 'lucide-react';

import { Accordion } from '@radix-ui/react-accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { AccordionMenu } from './AccordionMenu';
import { NavigationMenuGroup } from './NavigationMenuGroup';

const visualiserMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Cartographie',
    href: '/map',
    description: 'Quelles sont les collectivités les plus transparentes ?',
  },
  {
    title: 'Recherche avancée',
    href: '/advanced-search',
    description: 'Quelles sont les dépenses publiques dans ma collectivité ?',
  },
  {
    title: 'Interpeller',
    href: '/interpeller',
    description: 'Comment inciter mes élus à plus de transparence ?',
  },
  {
    title: 'Perspectives',
    href: '/perspectives',
    description:
      'Quelles sont les grandes tendances en matière de transparence des dépenses publiques locales ?',
  },
];

const comprendreMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Contexte',
    href: '/contexte',
    description: 'Quels sont les enjeux de la transparence des dépenses publiques ?',
  },
  {
    title: 'Méthodologie',
    href: '/methodologie',
    description: 'Comment sont évalués les scores de transparence et tendance de mes collectivités',
  },
  {
    title: 'Cadre réglementaire',
    href: '/cadre-reglementaire',
    description: 'Quelles sont les obligations des collectivités ? ',
  },
];

const aProposMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Qui sommes-nous ?',
    href: '/qui-sommes-nous',
    description: 'Transparency International France, ANTICOR, Data for Good',
  },
  {
    title: 'Le projet',
    href: '/le-projet',
    description: 'Comment la transparence éclaire les citoyens ?',
  },
  {
    title: 'Aide aux élus',
    href: '/aide-aux-elus',
    description: 'Comment améliorer la transparence dans ma collectivité ?',
  },
  {
    title: 'Foire aux questions',
    href: '/faq',
    description: '',
  },
  {
    title: 'Contact',
    href: '/contact',
    description: '',
  },
];

export default function Navbar() {
  return (
    <div className='fixed z-50 w-full border-b bg-white shadow-sm'>
      <div className='flex h-16 items-center justify-between px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
            <Image
              src='/logo-e.svg'
              alt='Éclaireur Public Logo'
              width={24}
              height={24}
              className='text-secondary-foreground'
            />
          </div>
          <div className='flex flex-col leading-tight'>
            <span className='text-base font-bold uppercase text-primary'>Éclaireur</span>
            <span className='text-base font-bold text-primary'>PUBLIC</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            <NavigationMenuGroup title='Visualiser' menus={visualiserMenus} />
            <NavigationMenuGroup title='Comprendre' menus={comprendreMenus} />
            <NavigationMenuItem>
              <Link href='/advanced-search' legacyBehavior passHref>
                <NavigationMenuLink className='text-base font-medium text-primary hover:text-primary/80'>
                  Télécharger
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuGroup title='À propos' menus={aProposMenus} />
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search and Settings */}
        <div className='flex items-center space-x-4'>
          <div className='relative hidden md:block'>
            <Input
              type='search'
              placeholder='Rechercher...'
              className='w-64 rounded-none rounded-br-lg rounded-tl-lg border-gray-300 pr-10 pl-4 bg-primary-500'
            />
            <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary border-primary text-primary-400 focus:border-primary' />
          </div>
          <Button
            size='sm'
            className='hidden rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90 md:inline'
          >
            <Megaphone className='h-4 w-4' />
          </Button>
          {/* Mobile Menu */}
          <div className='md:hidden'>
            <MobileNavigationMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavigationMenu() {
  return <div className='md:hidden' >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='rounded-full p-2 '>
          <Menu className='h-5 w-5 text-primary hover:bg-primary/10' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={20}
        className='z-50 top-16 w-screen rounded-none border-none bg-white px-4 py-6 shadow-md rounded-b-3xl overflow-auto'
        align='start'
        side='top'
      >
        {/* Search Bar */}
        <div className='relative mb-4'>
          <Input
            type='search'
            placeholder='Rechercher...'
            className='w-full h-12 border pr-10 text-primary pl-4 rounded-none rounded-tl-xl rounded-br-xl focus:m-0 focus-visible:ring-offset-0 focus-visible:ring-primary ring-primary-400'
          />
          <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
        </div>

        {/* Interpeller Button */}
        <Button className='w-full mb-4 h-12 bg-primary text-white rounded-none rounded-tl-xl rounded-br-xl font-semibold text-xl'>
          <Megaphone className='mr-2 h-4 w-4' />
          Interpeller
        </Button>

        {/* Accordion Menu */}
        <Accordion type='single' collapsible className='w-full'>
          <AccordionMenu title='Visualiser' menus={visualiserMenus} />
          <AccordionMenu title='Comprendre' menus={comprendreMenus} />
          <div className='border-b border-primary-200'>
            <Link href='/advanced-search'>
              <div className='py-4 text-left text-lg font-semibold text-primary hover:text-primary/80 transition-colors'>
                Télécharger
              </div>
            </Link>
          </div>
          <AccordionMenu title='À propos' menus={aProposMenus} last={true} />
        </Accordion>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
}

