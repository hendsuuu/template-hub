{{--
    The signed-in shell: sidebar (collapsible to icons above 900px, a popover
    drawer below), the top bar and the page. The drawer needs no script to open:
    the menu button is its popover target.
--}}
@props(['title', 'heading' => null])
<x-layouts.base :title="$title.' · Agent hub'">
    <div class="ak-shell">
        <a href="#main" class="ak-skip">Skip to content</a>

        <aside class="ak-shell__sidebar" aria-label="Sidebar">
            <x-ak.sidebar mode="rail" />
        </aside>

        <div id="ak-nav-drawer" popover="auto" class="ak-nav-drawer" aria-label="Menu">
            <x-ak.sidebar mode="drawer" />
        </div>

        <div class="ak-shell__column">
            <x-ak.top-bar :title="$heading" />
            <main id="main" tabindex="-1" class="ak-shell__content">{{ $slot }}</main>
        </div>
    </div>
</x-layouts.base>
