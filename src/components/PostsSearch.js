
export default ({ posts, setFilterdPosts }) => {
    const filter = value => setFilterdPosts(posts.filter(post => post.title.includes(value)))
    return (
        <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="ابحث عن ما تريده"
            onChange={e => filter(e.target.value)}
        />
    )
}