import { SkeletonVariant } from "./Skeleton.types"

export const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-xl",
}
