public class CircularArray<T>(int capacity)
{
    private readonly T[] array = new T[capacity];
    private int start = 0;
    private int end = 0;

    public T? Enqueue(T item)
    {
        T? removedItem = default;
        if ((end + 1) % array.Length == start)
        {
            removedItem = array[start];
            start = (start + 1) % array.Length;
        }
        array[end] = item;
        end = (end + 1) % array.Length;
        return removedItem;
    }

    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Queue is empty");
        }
        T result = array[start];
        start = (start + 1) % array.Length;
        return result;
    }

    public bool IsEmpty()
    {
        return start == end;
    }

    public T[] ToArray()
    {
        return array;
    }
}