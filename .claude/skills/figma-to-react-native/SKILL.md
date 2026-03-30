---
name: figma-to-react-native
description: >
  Convert Figma designs (images, screenshots, or Figma MCP data) into production-ready
  React Native code with TypeScript. Use this skill whenever the user:
  - Shares a Figma screenshot, design image, or Figma link and asks to build a screen/component
  - Says "convert this design to React Native", "build this UI in RN", "implement this Figma"
  - Asks to create a React Native screen that matches a visual mockup
  - Mentions "figma + react native", "mobile UI from design", "RN component from design"
  - Uploads any UI image and asks for React Native or mobile implementation
  Always use this skill for any Figma → React Native / TypeScript task, even if the user
  just says "code this up" while sharing a design image.
---

# Figma → React Native (TypeScript) Skill

Transform Figma designs into clean, production-grade React Native + TypeScript code.

---

## Workflow Overview

```
1. Analyze Design  →  2. Extract Tokens  →  3. Plan Components  →  4. Generate Code  →  5. Review & Refine
```

---

## Step 1 — Analyze the Design Input

### Input Sources (in priority order)

| Source              | How to get data                                                      |
| ------------------- | -------------------------------------------------------------------- |
| Figma MCP connected | Use `Figma:get_design_context` → full node tree, styles, auto-layout |
| Figma URL provided  | Fetch via Figma MCP if connected, otherwise ask user to screenshot   |
| Image / screenshot  | Visually analyze: layout, spacing, colors, typography, components    |
| Written description | Ask clarifying questions before proceeding                           |

### What to extract from the design

- **Layout**: direction (row/column), alignment, gap/spacing values
- **Colors**: exact hex values or design token names
- **Typography**: font family, size, weight, line-height, letter-spacing
- **Spacing**: margin, padding, border-radius (prefer multiples of 4)
- **Components**: identify reusable pieces (buttons, cards, inputs, icons)
- **State**: default, pressed, disabled, loading, error states
- **Assets**: images, icons (note if they need `react-native-vector-icons` or SVG)

---

## Step 2 — Design Token Extraction

Always create a `theme.ts` (or extend existing one) with extracted values.

```typescript
// theme.ts — always generate this if project doesn't have one
export const colors = {
  primary: '#007AFF',
  // ... extracted from design
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  // ...
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;
```

---

## Step 3 — Component Planning

Before writing code, plan the component tree:

```
Screen (SafeAreaView)
├── Header (custom or react-navigation)
├── ScrollView / FlatList (if list)
│   ├── Section (View)
│   │   ├── SectionTitle (Text)
│   │   └── CardList (FlatList)
│   │       └── Card (TouchableOpacity)
│   │           ├── CardImage (Image / FastImage)
│   │           └── CardContent (View)
│   │               ├── CardTitle (Text)
│   │               └── CardSubtitle (Text)
└── BottomBar / TabBar
```

---

## Step 4 — Code Generation Rules

### File Structure

```
src/
├── screens/
│   └── FeatureScreen.tsx        # Full screen
├── components/
│   ├── common/                  # Shared (Button, Input, Card…)
│   └── feature/                 # Feature-specific
├── theme/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
└── types/
    └── feature.types.ts
```

### TypeScript Rules

- **All props must be typed** — use `interface`, not `type` for component props
- **No `any`** — if unknown, use `unknown` and narrow it
- **Explicit return types** on all functions that return JSX: `React.ReactElement`
- **Import React** explicitly: `import React from 'react'`
- **StyleSheet.create** for all styles — no inline style objects except for dynamic values

```typescript
// ✅ CORRECT
interface CardProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, onPress, imageUrl }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  // ...
});

export default Card;
```

### Layout Rules (Flexbox)

- **Default axis is vertical** — `flexDirection: 'column'` by default in RN
- Use `flex: 1` to fill available space
- Prefer `gap` (RN 0.71+) over manual margins for even spacing
- Use `alignItems` / `justifyContent` consistently
- **Safe areas**: always wrap screens in `<SafeAreaView>` from `react-native-safe-area-context`

```typescript
// ✅ Screen template
import { SafeAreaView } from 'react-native-safe-area-context';

const MyScreen: React.FC = () => (
  <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
    {/* content */}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5' },
});
```

### Pixel-Perfect Matching

- Match **exact color values** from design (use eyedropper values from Figma)
- Match **border-radius** precisely
- Match **font sizes** exactly — common: 12, 14, 16, 18, 20, 24, 28, 32
- Match **spacing** — use 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 48)
- Use `Dimensions.get('window')` for responsive widths only when needed

### Common Component Patterns

#### Button

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}
```

#### Input Field

```typescript
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

#### List Item / Card

```typescript
interface ListItemProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  onPress: (id: string) => void;
}
```

### Navigation (React Navigation v6)

```typescript
// types/navigation.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
```

### State Management Hints

- **Local UI state** → `useState`
- **Async/server state** → `useQuery` (React Query / TanStack Query)
- **Global state** → `zustand` (prefer) or `Context`
- **Forms** → `react-hook-form` + `zod`

---

## Step 5 — Quality Checklist

Before finishing, verify:

- [ ] All props are typed (no implicit `any`)
- [ ] `StyleSheet.create` used for all static styles
- [ ] Colors/spacing from `theme.ts`, not hardcoded in components
- [ ] `SafeAreaView` wrapping screens
- [ ] `activeOpacity` on `TouchableOpacity` (use `0.7` or `0.8`)
- [ ] Images have `resizeMode` set
- [ ] Lists use `keyExtractor` returning unique string
- [ ] Loading and empty states handled
- [ ] No `console.log` left in code (use `// TODO: remove` if needed for debug)
- [ ] Accessibility: `accessible`, `accessibilityLabel` on interactive elements

---

## Reference Files

Read these when you need deeper guidance:

- `references/rn-patterns.md` — Advanced patterns: FlatList optimization, Animated API, custom hooks
- `references/figma-mapping.md` — Mapping Figma properties → RN StyleSheet properties
- `references/common-components.md` — Ready-to-use component templates

---

## Example Prompt Handling

### User shares a screenshot + asks for code

1. Describe what you see in the design (confirm understanding)
2. Extract design tokens
3. Plan component tree
4. Generate: `theme/` files first → shared components → screen

### User shares Figma link (MCP available)

1. Call `Figma:get_design_context` with the node ID
2. Parse auto-layout, fills, typography from the response
3. Map to RN styles (see `references/figma-mapping.md`)
4. Generate code

### User asks to "match the design exactly"

- Add a `// DESIGN NOTE:` comment on any value you estimated
- List all assumptions at the top of the file

---

## Dependencies Cheatsheet

```json
{
  "react-native-safe-area-context": "latest",
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "react-native-vector-icons": "^10.x",
  "react-native-fast-image": "^8.x",
  "@tanstack/react-query": "^5.x",
  "zustand": "^4.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x"
}
```
