import {renderHook, act } from "@testing-library/react";
import { describe,  expect, vi, it} from "vitest";
import useCollection from "../src/hooks/useCollection";
import { error } from "console";
  // Assert that the hook subscribes to the collection
describe('subscribeCollection', () => {
    it('calls juno.subscribeCollection on mount', async () => {

        const juno = {
            subscribeCollection: vi.fn()
        };

        const subscribe = vi.fn();
        vi.spyOn(juno, 'subscribeCollection').mockReturnValue(subscribe);

       const { unmount } = renderHook(() => useCollection('post'));
       // Simulate unmounting the component
        expect(juno.subscribeCollection).toHaveBeenCalledWith('post', expect.any(() => { juno }));

        act(() => {
            unmount()
        })
        expect(subscribe).toHaveBeenCalled();
    });

    it('updates Docs when receiving new data', async () => {

        //const docs = [];
        const { result } =  renderHook(() => useCollection('post'))

        try {
            renderHook(() => useCollection('post')).result.current.docs;
        } catch {
            error('not correct')
        }


        newFunction(result);

        expect(result.current.docs).toEqual([{id: 1}]);

    });
     // Assert that the document is added
    describe('addDoc', () => {
        it('adds doc to docs array', () => {

            const { result } = renderHook(() => useCollection('post'));

            act(() => {
                result.current.addDoc({
                    id: 1, text: 'Hello world',
                    data: undefined
                });   
            });
            expect(result.current.docs).toEqual([{
                id: 1, text: 'Hello world', data: undefined
            }]);
        });  
    });

    it('calls setDoc with newDocs', () => {

        const juno = {
            setDoc: vi.fn()
        }

        const setDoc = vi.fn();
        vi.spyOn(juno, 'setDoc').mockReturnValue(juno);

        const { result } = renderHook(() => useCollection('post'));

        act(() => {
            result.current.addDoc({
                collection: "post",
                doc: {
                    key: expect.any(String),
                    data: {
                        id: 1
                    }
                },
                data: undefined
            })
        });

        expect(setDoc).toHaveBeenCalledWith({
            collection: "post",
            doc: {
                key: expect.any(String),
                data: {
                    id: 1
                }
            }
        });
    });

    // Simulate updating a document
    describe('updatedDoc', () => {
        it('updates target doc in docs array', () => {

            const { result } = renderHook(() => useCollection('post'));

            act(() => {
                result.current.addDoc({id:1, text: 'Original', data: undefined})
            });

            act(() => {
                result.current.updatedDoc('1', { text: 'updated' });
            });

            expect(result.current.docs).toEqual([{
                id: 1,
                text: 'updated',
                data: undefined
            }]);
        });

        // Assert that the document is updated
        it('calls setDoc with doc updates', () => {

            const juno = {
                setDoc: vi.fn()
            }
            const setDoc = vi.fn();
            vi.spyOn(juno, 'setDoc').mockReturnValue(setDoc);

            const { result } = renderHook(() => useCollection('post'));

            act(() => {
                result.current.updatedDoc('1',{text: 'updated'});
            });

            expect(setDoc).toBeCalledWith({
                collection: 'post',
                doc: {
                    key: '1',
                    data: {
                        text: 'updated'
                    }
                }
            });
        });  
    });
    describe('docs', () => {

        it('loads initial empty state', () => {

            const { result } = renderHook(() => useCollection('post'));

            expect(result.current.docs).toEqual([]);
        });
        
        it('reflects realtime change', async () => {

            const subscribe = vi.fn().mockImplementationOnce((_, callback) => {
                callback([{id: 1}]);
            });

            const juno = {
                subscribeCollection: vi.fn()
            }

            vi.spyOn(juno, 'subscribeCollection')
              .mockReturnValue(subscribe);
            
            vi.useFakeTimers();

            const { result } = renderHook(()=> useCollection('post'));

            act(() => {
                vi.advanceTimersByTime(100);
            });

            expect(result.current.docs).toEqual([{id: 1}]);

            subscribe.mockImplementationOnce((_, callBack) => {
                callBack([{id: 1}, {id: 2}]);
            });

            act(() => {
                vi.useRealTimers()
            });

            expect(result.current.docs).toEqual([{id: 1}, {id: 2}]);
        })
    })
});

function newFunction(result: { current: {
    [x: string]: any; docs: { [key: string]: any; data: any; }[]; isLoading: boolean; error: null; addDoc: (doc: { [key: string]: any; data: any; }) => void; updatedDoc: (id: string, updates: object) => void; 
}; }) {
    act(() => {
        result.current.setDocs([{ id: 1 }]);
    });
}
