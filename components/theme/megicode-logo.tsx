'use client'

import { useTheme } from 'next-themes'
import Image, { type ImageProps } from 'next/image'

type MegicodeLogoProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

export function MegicodeLogo(props: MegicodeLogoProps) {
  const { theme } = useTheme()

  const logoSrc =
    theme === 'dark'
      ? '/megicode-logo-square-darkscreen.svg'
      : '/megicode-logo-square-lightscreen.svg'

  return <Image src={logoSrc} alt={props.alt ?? 'Megicode'} {...props} />
}
