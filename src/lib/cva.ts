// Simple replacement for class-variance-authority to fix import errors
export type VariantProps<T extends (...args: any) => any> = Omit<NonNullable<Parameters<T>[0]>, "class" | "className">

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props: Record<string, any> = {}) => {
    if (!config) return base

    let classes = base

    if (config.variants) {
      Object.entries(config.variants).forEach(([key, variants]) => {
        const value = props[key] || config.defaultVariants?.[key]
        if (value && variants[value]) {
          classes += ` ${variants[value]}`
        }
      })
    }

    if (props.className) {
      classes += ` ${props.className}`
    }

    return classes
  }
}
