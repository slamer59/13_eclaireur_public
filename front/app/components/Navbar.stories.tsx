import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
    title: 'Components/Navbar',
    component: Navbar,
    parameters: {
        layout: 'fullscreen',
        nextjs: {
            appDirectory: true,
            navigation: {
                push: fn(),
                replace: fn(),
                back: fn(),
                forward: fn(),
                refresh: fn(),
                prefetch: fn(),
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithBackground: Story = {
    args: {},
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
                <Story />
                <div style={{ padding: '80px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Page Content Example
                    </h1>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        This shows how the navbar looks with page content below it. The navbar is fixed at the top
                        and creates proper spacing for the content underneath.
                    </p>
                </div>
            </div>
        ),
    ],
};

export const Mobile: Story = {
    args: {},
    parameters: {
        layout: 'fullscreen',
    },
    globals: {
        viewport: {
            value: 'iphone5',
        },
    },
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%' }}>
                <Story />
                <div style={{ padding: '80px 20px 20px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Mobile View
                    </h1>
                    <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.875rem' }}>
                        On mobile, the navigation menu is collapsed into a hamburger menu, and the search bar
                        is moved to the mobile menu.
                    </p>
                </div>
            </div>
        ),
    ],
};
