/* eslint-disable */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white",
        secondary: "bg-zinc-700 text-white hover:bg-zinc-600",
        ghost: "hover:bg-zinc-800 hover:text-white",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className]
 * @property {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"} [variant]
 * @property {"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"} [size]
 * @property {boolean} [asChild]
 */

const Button = React.forwardRef(
  /**
   * @param {ButtonProps & React.ComponentProps<"button">} param0
   * @param {React.Ref<HTMLButtonElement>} ref
   */
  function Button(
    { className, variant = "default", size = "default", asChild = false, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  });

Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };


// import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cva } from "class-variance-authority";
// import { cn } from "../../../lib/utils";


// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
//   {
//     variants: {
//       variant: {
//         default: "bg-blue-600 text-white hover:bg-blue-700",
//         destructive: "bg-red-600 text-white hover:bg-red-700",
//         outline: "border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white",
//         secondary: "bg-zinc-700 text-white hover:bg-zinc-600",
//         ghost: "hover:bg-zinc-800 hover:text-white",
//         link: "text-blue-500 underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-9 px-4 py-2",
//         sm: "h-8 rounded-md gap-1.5 px-3",
//         lg: "h-10 rounded-md px-6",
//         icon: "h-9 w-9",
//         "icon-sm": "h-8 w-8",
//         "icon-lg": "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// /**
//  * @typedef {Object} ButtonProps
//  * @property {string} [className]
//  * @property {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"} [variant]
//  * @property {"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"} [size]
//  * @property {boolean} [asChild]
//  */

// const Button = React.forwardRef(
//   /**
//    * @param {ButtonProps & React.ComponentProps<"button">} param0
//    * @param {React.Ref<HTMLButtonElement>} ref
//    */
//   function Button(
//     { className, variant = "default", size = "default", asChild = false, ...props },
//     ref
//   ) {
//     const Comp = asChild ? Slot : "button";

//     return (
//       <Comp
//         data-slot="button"
//         data-variant={variant}
//         data-size={size}
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     );
//   });

// Button.displayName = "Button";

// // eslint-disable-next-line react-refresh/only-export-components
// export { Button, buttonVariants };
