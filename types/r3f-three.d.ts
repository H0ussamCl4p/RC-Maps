import { JSX as JSXInternal } from 'react'
import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    // Use R3F + React intrinsic elements; allow unknown tags as a fallback to avoid TS noise in TSX with three-js tags.
    interface IntrinsicElements extends JSXInternal.IntrinsicElements, ThreeElements {
      [elemName: string]: any
    }
  }
}
