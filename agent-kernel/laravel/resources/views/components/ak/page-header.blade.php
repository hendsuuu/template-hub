{{-- "Welcome back, Alex" and a one-line subtitle, with an `aside` slot on the right. --}}
@props(['title', 'subtitle'])
<div class="ak-page-header">
    <div class="ak-page-header__text">
        <p class="ak-page-header__title">{{ $title }}</p>
        <p class="ak-page-header__subtitle">{{ $subtitle }}</p>
    </div>
    @isset($aside)
        <div class="ak-page-header__aside">{{ $aside }}</div>
    @endisset
</div>
