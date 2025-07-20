import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Megaphone, Menu, Search } from 'lucide-react';

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
    <div className='fixed z-50 w-full bg-white shadow-sm border-b'>
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
            <span className='text-base font-bold text-gray-900 uppercase'>Éclaireur</span>
            <span className='text-base font-bold text-gray-900'>PUBLIC</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            <NavigationMenuGroup title='Visualiser' menus={visualiserMenus} />
            <NavigationMenuGroup title='Comprendre' menus={comprendreMenus} />
            <NavigationMenuItem>
              <Link href='/advanced-search' legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-primary hover:text-primary/80`}>
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
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='search'
              placeholder='Rechercher...'
              className='w-64 pl-10 pr-4 border-gray-300 rounded-none rounded-tl-lg rounded-br-lg'
            />
          </div>
          <Button size='sm' className='bg-primary hover:bg-primary/90 rounded-none rounded-tl-lg rounded-br-lg'>
            <Megaphone className='h-4 w-4' />
          </Button>

          {/* Mobile Menu */}
          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Éclaireur Public</SheetTitle>
                </SheetHeader>
                <div className='mt-6'>
                  <div className='relative mb-6'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                    <Input
                      type='search'
                      placeholder='Rechercher...'
                      className='pl-10 pr-4'
                    />
                  </div>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionMenu title='Visualiser' menus={visualiserMenus} />
                    <AccordionMenu title='Comprendre' menus={comprendreMenus} />
                    <Link href='/advanced-search'>
                      <p className='border-b py-4 text-left text-lg font-bold hover:underline'>
                        Télécharger
                      </p>
                    </Link>
                    <AccordionMenu title='À propos' menus={aProposMenus} />
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={`${className} block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`}
            {...props}
          >
            <div className='text-sm font-bold leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';

type MenuProps = { title: string; href: string; description: string };

type NavigationMenuGroupProps = {
  title: string;
  menus: MenuProps[];
};

function NavigationMenuGroup({ title, menus }: NavigationMenuGroupProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className='text-primary hover:text-primary/80'>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='w-[500px] gap-3 p-4'>
          {menus.map((menu) => (
            <ListItem key={menu.title} title={menu.title} href={menu.href}>
              {menu.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

type AccordionMenuProps = {
  title: string;
  menus: MenuProps[];
};

function AccordionMenu({ title, menus }: AccordionMenuProps) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger className='font-bold'>{title}</AccordionTrigger>
      <AccordionContent className='pl-3'>
        <ul className='space-y-3 divide-y divide-gray-200'>
          {menus.map((menu) => (
            <li key={menu.title}>
              <Link href={menu.href}>
                <p className='font-semibold'>{menu.title}</p>
                <p className='text-sm font-light text-gray-500'>{menu.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
