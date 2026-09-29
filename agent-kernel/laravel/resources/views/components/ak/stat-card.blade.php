{{--
    One figure: a header strip (icon and label) over a box with corner brackets
    holding the value, a mini chart and a meta line. Render inside a <dl>.
    Slots: `chart`, `meta`, `corner`.
--}}
@props(['icon', 'label', 'value', 'suffix' => null, 'attention' => false])
<div @class(['ak-stat', 'ak-stat--attention' => $attention, 'ak-stat--with-corner' => isset($corner)])>
    <dt class="ak-stat__head">
        <span class="ak-stat__icon" aria-hidden="true"><x-ak.icon :name="$icon" :size="14" /></span>
        <span class="ak-stat__label">{{ $label }}</span>
    </dt>
    <dd class="ak-stat__body">
        @isset($corner)
            <span class="ak-stat__corner">{{ $corner }}</span>
        @endisset
        <div class="ak-stat__inner ak-bracketed">
            <div class="ak-stat__row">
                <span class="ak-stat__value">{{ $value }}@if ($suffix)<span class="ak-stat__suffix"> {{ $suffix }}</span>@endif</span>
                @isset($chart)
                    <span class="ak-stat__chart">{{ $chart }}</span>
                @endisset
            </div>
            @isset($meta)
                <div class="ak-stat__meta">{{ $meta }}</div>
            @endisset
        </div>
    </dd>
</div>
