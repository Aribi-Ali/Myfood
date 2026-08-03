import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-orange-600')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border-2')
  })

  it('applies danger variant', () => {
    render(<Button variant="danger">Danger</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-red-600')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('px-6')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('fires onClick handler', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('accepts additional className', () => {
    render(<Button className="extra-class">Styled</Button>)
    expect(screen.getByRole('button').className).toContain('extra-class')
  })
})

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Content</p></Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<Card><p>Content</p></Card>)
    const card = screen.getByText('Content').parentElement
    expect(card?.className).toContain('rounded-xl')
  })

  it('accepts additional className', () => {
    render(<Card className="custom"><p>Content</p></Card>)
    const card = screen.getByText('Content').parentElement
    expect(card?.className).toContain('custom')
  })
})

describe('CardHeader', () => {
  it('renders children with border', () => {
    render(<CardHeader><h2>Header</h2></CardHeader>)
    const header = screen.getByText('Header').parentElement
    expect(header?.className).toContain('border-b')
  })
})

describe('CardContent', () => {
  it('renders children with padding', () => {
    render(<CardContent><p>Body</p></CardContent>)
    const content = screen.getByText('Body').parentElement
    expect(content?.className).toContain('p-5')
  })
})
