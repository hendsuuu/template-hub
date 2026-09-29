{{-- An agent's picture: the robot on a small tile. Swap in your own images here. --}}
@props(['size' => 'md'])
<span @class(['ak-agent-avatar', 'ak-agent-avatar--sm' => $size === 'sm']) aria-hidden="true"><x-ak.icon name="bot" :size="$size === 'sm' ? 14 : 16" /></span>
