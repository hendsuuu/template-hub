{{-- A non-blocking notice. Render it inside an aria-live region so it is announced. --}}
<div class="ak-banner">
    <x-ak.icon name="triangle-alert" :size="18" />
    <p class="flex-[1_1_220px]">{{ $slot }}</p>
    {{ $action ?? '' }}
</div>
