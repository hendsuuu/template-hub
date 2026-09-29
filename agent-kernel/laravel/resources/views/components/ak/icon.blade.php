{{-- A Lucide icon as inline SVG. Add icons by copying their files into resources/svg/lucide. --}}
@props(['name', 'size' => 16, 'class' => null, 'strokeWidth' => 2])
@use('App\Support\AgentHub\Icons')
{!! Icons::svg($name, (int) $size, $class, (float) $strokeWidth) !!}
