@props(['status'])
@use('App\Support\AgentHub\Status')
@php($info = Status::AGENT[$status])
<span class="ak-status ak-status--{{ $info['tone'] }}" title="{{ $info['meaning'] }}">
    <x-ak.status-dot :status="$status" />
    {{ $info['label'] }}
    <span class="sr-only">. {{ $info['meaning'] }}</span>
</span>
