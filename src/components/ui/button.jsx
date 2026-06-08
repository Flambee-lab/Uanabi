import * as React from "react"

import { cva } from "class-variance-authority";

import { Slot } from "radix-ui"



import { cn } from "@/lib/utils"



/**

 * Sistema de botones Uanabi

 *

 * Jerarquía (variant):

 * - primary / default — acción principal

 * - secondary / outline — acción secundaria con borde

 * - tertiary / ghost — acción terciaria, mínima

 *

 * Tamaños (size):

 * - sm   — h-8,  text-xs font-semibold,  rounded-xl

 * - default (md) — h-10, text-sm font-semibold, rounded-xl

 * - lg / event — h-11, text-sm font-bold, rounded-2xl (CTAs destacados)

 */

const buttonVariants = cva(

  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",

  {

    variants: {

      variant: {

        primary:

          "bg-primary text-primary-foreground hover:bg-primary/80",

        default:

          "bg-primary text-primary-foreground hover:bg-primary/80",

        secondary:

          "border-navbar-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        outline:

          "border-navbar-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        tertiary:

          "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        ghost:

          "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        destructive:

          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

        link:

          "h-auto min-h-0 rounded-none border-0 p-0 text-sm font-semibold text-primary underline-offset-4 hover:underline",

        match:

          "bg-match text-match-foreground hover:bg-[color-mix(in_oklch,var(--color-match),var(--color-match-foreground)_6%)]",

      },

      size: {

        sm:

          "h-8 gap-1.5 px-3 text-xs font-semibold leading-none in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",

        default:

          "h-10 gap-2 px-4 text-sm font-semibold in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",

        lg:

          "h-11 gap-2 rounded-2xl px-5 text-sm font-bold has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",

        event:

          "h-11 gap-2 rounded-2xl px-5 text-sm font-bold has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",

        xs:

          "h-7 gap-1 rounded-lg px-2.5 text-xs font-semibold leading-none in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

        icon:

          "size-10 [&_svg:not([class*='size-'])]:size-4",

        "icon-xs":

          "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",

        "icon-sm":

          "size-8 in-data-[slot=button-group]:rounded-xl [&_svg:not([class*='size-'])]:size-3.5",

        "icon-lg": "size-11 rounded-2xl [&_svg:not([class*='size-'])]:size-4",

      },

    },

    compoundVariants: [

      {

        variant: "link",

        className: "px-0",

      },

    ],

    defaultVariants: {

      variant: "default",

      size: "default",

    },

  }

)



function Button({

  className,

  variant = "default",

  size = "default",

  asChild = false,

  ...props

}) {

  const Comp = asChild ? Slot.Root : "button"



  return (

    <Comp

      data-slot="button"

      data-variant={variant}

      data-size={size}

      className={cn(buttonVariants({ variant, size, className }))}

      {...props} />

  );

}



export { Button, buttonVariants }


