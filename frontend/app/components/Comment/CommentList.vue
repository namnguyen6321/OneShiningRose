<script setup>
const comments = [
    {
        id: 1,
        user: 'Nguyễn Văn A',
        avatar: '/avatar1.png',
        content: 'Video hay quá, nhìn muốn đi thử luôn 😍',
        time: '2 giờ trước',
    },
    {
        id: 2,
        user: 'Trần Thị B',
        avatar: '/avatar2.png',
        content: 'Tôi cũng đã thử skydiving một lần, cảm giác phê cực!',
        time: '1 ngày trước',
    },
    {
        id: 3,
        user: 'Lê Văn C',
        avatar: '/avatar3.png',
        content: 'Xem mà thấy run tay chân 😅',
        time: '3 ngày trước',
    },
]
</script>

<template>
    <div class="space-y-2 h-full overflow-y-auto">
        <h3 class="text-lg font-semibold">Bình luận</h3>
        <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
</template>