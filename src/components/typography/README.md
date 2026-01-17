排版专用组件，以后可能会给MDX用

## P.astro

```jsx
<div class={cn('paragraph', className)} {...rest}>
  <slot />
</div>
```

`paragraph`等同于`gap-strat flex items-center`

## T.astro

```jsx
<h4 class={cn('text-2xl', className)} {...rest}>
  <slot>
    <Span variant={variant}>{text}</Span>
  </slot>
</h4>
```

## ImgWrapper.astro

在 Image 组件下方加上了 title

## ImgRow.astro

一整行 flex 布局的 ImgWrapper

## ImgGrid.astro

图片表格，方便用于列出不同情况对比

示例参考：

- Xfang.astro: /07/m8s1/p1#stonefang-or-windfang
