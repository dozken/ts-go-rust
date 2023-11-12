package main

import (
	"fmt"
	"log"

	"github.com/dozken/ts-go-rust/pkg/projector"
)

func main() {
	opts, err := projector.GetOpts()
	if err != nil {
		log.Fatalf("unable to get opts: %v", err)
	}

  config, err := projector.NewConfig(opts)
	if err != nil {
		log.Fatalf("unable to get config: %v", err)
	}

  fmt.Printf("opts: %+v\n", opts)
  fmt.Printf("config: %+v\n", config)
}
